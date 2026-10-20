import assert from 'node:assert/strict'
import { once } from 'node:events'
import { createServer } from 'node:http'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright'

const root = fileURLToPath(new URL('../../', import.meta.url))
const bundle = async (contents) => {
  const result = await build({
    stdin: { contents, resolveDir: root },
    bundle: true,
    format: 'esm',
    external: ['node:*', 'electron', 'ws'],
    write: false,
  })
  return result.outputFiles[0].text
}

test('precreated workers retain their port for normal initialization, reuse and reload cleanup', async () => {
  const parent = await bundle(`
    export * as PreloadWorker from './renderer-process/src/parts/PreloadWorker/PreloadWorker.ts'
    export * as IpcParent from './renderer-process/src/parts/IpcParent/IpcParent.ts'
    export * as IpcStates from './renderer-process/src/parts/IpcStates/IpcStates.ts'
    export * as RendererWorker from './renderer-process/src/parts/RendererWorker/RendererWorker.ts'
    export * as WorkerRegistry from './renderer-process/src/parts/WorkerRegistry/WorkerRegistry.ts'
    export { MessagePortRpcParent } from '@lvce-editor/rpc'
  `)
  const child = await bundle(`
    import { WebWorkerRpcClient } from '@lvce-editor/rpc'
    let initialized = false
    WebWorkerRpcClient.create({ commandMap: {
      'Initialize.initialize': () => { initialized = true },
      'Test.read': () => initialized ? 'ready' : 'cold',
    } })
  `)
  const server = createServer((request, response) => {
    response.setHeader('Content-Type', request.url === '/' ? 'text/html' : 'text/javascript')
    response.end(request.url === '/parent.js' ? parent : request.url === '/child.js' ? child : '<html></html>')
  })
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  let browser
  try {
    browser = await chromium.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(`http://127.0.0.1:${server.address().port}`)
    await page.evaluate(async (parentUrl) => {
      const api = await import(parentUrl)
      const config = document.createElement('script')
      config.id = 'Config'
      config.type = 'application/json'
      config.textContent = JSON.stringify({ workerUrls: { 'develop.fileSystemWorkerPath': '/child.js' } })
      document.head.append(config)
      const result = await api.PreloadWorker.preloadWorker(
        'File System Worker',
        'file-system-worker',
        'fileSystemWorkerMain.js',
        'develop.fileSystemWorkerPath',
      )
      if (!result.ok) throw result.error
      if (api.WorkerRegistry.getCount() !== 1) throw new Error('Preload did not create one worker')
      let transferredPort
      api.RendererWorker.state.rpc = {
        invokeAndTransfer: async (method, id, port) => {
          if (method !== 'Transferrable.transfer' || id !== 42) throw new Error('Unexpected handoff')
          transferredPort = port
        },
      }
      // This is the same name-based request used by the normal renderer-worker launcher.
      await api.IpcParent.create({ method: 0, name: 'File System Worker', id: 42 })
      if (api.IpcStates.has('File System Worker')) throw new Error('Port was not consumed')
      transferredPort.start()
      const rpc = await api.MessagePortRpcParent.create({ commandMap: {}, isMessagePortOpen: true, messagePort: transferredPort })
      if ((await rpc.invoke('Test.read')) !== 'cold') throw new Error('Worker was initialized too early')
      await rpc.invoke('Initialize.initialize')
      if ((await rpc.invoke('Test.read')) !== 'ready') throw new Error('Normal initialization failed')
      if (api.WorkerRegistry.getCount() !== 1) throw new Error('Normal request created a duplicate worker')
      await rpc.dispose()
      api.WorkerRegistry.terminateAll()
      api.IpcStates.clear()
      if (api.WorkerRegistry.getCount() !== 0) throw new Error('Reload left a worker alive')
    }, '/parent.js')
    assert.equal(page.workers().length <= 1, true)
  } finally {
    await browser?.close()
    await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  }
})
