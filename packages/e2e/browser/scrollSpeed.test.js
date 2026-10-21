import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright'

test('wheel listeners scale once through the router and clear their settings on disposal', async () => {
  const result = await build({
    stdin: {
      contents: `
        export * as Viewlet from './Viewlet/Viewlet.ts'
        export * as VirtualDom from './VirtualDom/VirtualDom.ts'
        export * as Router from './ViewletEventRouter/ViewletEventRouter.ts'
        export * as RendererWorker from './RendererWorker/RendererWorker.ts'
        export * as ComponentUid from './ComponentUid/ComponentUid.ts'
      `,
      resolveDir: fileURLToPath(new URL('../../renderer-process/src/parts/', import.meta.url)),
    },
    bundle: true,
    format: 'iife',
    external: ['node:*', 'electron', 'ws'],
    globalName: 'Api',
    write: false,
  })
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.addScriptTag({ content: result.outputFiles[0].text })
    const received = await page.evaluate(() => {
      const { Viewlet, VirtualDom, Router, RendererWorker, ComponentUid } = globalThis.Api
      const calls = []
      RendererWorker.state.rpc = { send: (...args) => calls.push(args) }
      VirtualDom.setIpc(Router)
      Viewlet.createFunctionalRoot('Test', 42, true)
      Viewlet.executeCommands([
        ['Viewlet.registerEventListeners', 42, [{ name: 'wheel', params: ['handleWheel', 'event.deltaMode', 'event.deltaX', 'event.deltaY'] }], 1.5],
      ])
      Viewlet.executeCommands([
        ['Viewlet.setDom2', 42, [{ type: 4, childCount: 0, className: 'ScrollTarget', onWheel: 'wheel' }]],
        ['Viewlet.appendToBody', 42],
      ])
      const target = document.body.firstElementChild
      ComponentUid.set(target, 42)
      const wheel = () => target.dispatchEvent(new WheelEvent('wheel', { deltaX: -10, deltaY: 20, deltaMode: 0 }))
      wheel()
      Viewlet.executeCommands([['Viewlet.setScrollSpeed', 42, 3]])
      wheel()
      Viewlet.dispose(42)
      wheel()
      return calls
    })
    assert.deepEqual(received, [
      ['Viewlet.executeViewletCommand', 42, 'handleWheel', 0, -15, 30],
      ['Viewlet.executeViewletCommand', 42, 'handleWheel', 0, -30, 60],
      ['Viewlet.executeViewletCommand', 42, 'handleWheel', 0, -10, 20],
    ])
  } finally {
    await browser.close()
  }
})
