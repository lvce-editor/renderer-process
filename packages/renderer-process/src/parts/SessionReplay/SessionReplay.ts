import type { RecordingOptions, ReplayClient } from '@lvce-editor/session-replay-worker/api'
import { PlainMessagePortRpcParent } from '@lvce-editor/rpc'
import { capture, createClient, mountPlayer, observe } from '@lvce-editor/session-replay-worker/api'
import * as CommandMapRef from '../CommandMapRef/CommandMapRef.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const state: {
  client: ReplayClient | undefined
  enabled: boolean
  proxy: boolean
  stopObserving: (() => void) | undefined
  lastError: string
} = { client: undefined, enabled: false, lastError: '', proxy: false, stopObserving: undefined }
const workerUrl = new URL('sessionReplayWorkerMain.js', import.meta.url)
const reloadMessage = 'Reload the window to start session replay with the complete DOM command history'

const report = (error: unknown): void => {
  state.lastError = error instanceof Error ? error.message : String(error)
  state.stopObserving?.()
  state.stopObserving = undefined
  console.warn(`Session replay: ${state.lastError}`)
}

// Retain snapshot recording for older renderer workers during dependency rollout.
export const configure = async (options: RecordingOptions): Promise<string> => {
  state.stopObserving?.()
  state.stopObserving = undefined
  state.enabled = false
  if (state.client) {
    try {
      await state.client.invoke('stop')
    } catch (error) {
      report(error)
    }
    // Live channels still need their proxy after capture stops.
    if (!state.proxy) {
      state.client.dispose()
      state.client = undefined
    }
  }
  if (!options.local && !options.upload) return ''
  if (state.proxy) throw new Error(reloadMessage)
  state.lastError = ''
  const client = createClient(workerUrl)
  try {
    const id = await client.invoke('start', options)
    state.stopObserving = observe(document, (type, data) => client.invoke('record', type, data), report)
    state.client = client
    state.enabled = true
    return id
  } catch (error) {
    client.dispose()
    throw error
  }
}

export const configureProxy = async (options: RecordingOptions, port: MessagePort): Promise<string> => {
  if (state.client || (!options.local && !options.upload)) {
    port.close()
    throw new Error(reloadMessage)
  }
  const client = createClient(workerUrl)
  let proxyPort: MessagePort | undefined
  try {
    const id = await client.invoke('start', options, capture(document))
    proxyPort = await client.invokeAndTransfer('proxy', port)
    const rpc = await PlainMessagePortRpcParent.create({ commandMap: CommandMapRef.commandMapRef, messagePort: proxyPort })
    const original = RendererWorker.state.rpc
    RendererWorker.state.rpc = {
      ...rpc,
      async dispose(): Promise<void> {
        try {
          await rpc.dispose()
        } finally {
          client.dispose()
          state.client = undefined
          state.enabled = false
          state.proxy = false
          await original?.dispose()
        }
      },
    }
    state.client = client
    state.enabled = true
    state.proxy = true
    state.lastError = ''
    return id
  } catch (error) {
    proxyPort?.close()
    port.close()
    client.dispose()
    throw error
  }
}

export const getSession = async () => {
  if (!state.enabled || !state.client) throw new Error('Session replay is disabled in settings')
  return state.client.invoke('export')
}

export const getStatus = async () => {
  if (!state.client) return { enabled: false, error: state.lastError }
  return { enabled: state.enabled, ...(await state.client.invoke('status')), captureError: state.lastError }
}

export const flush = async () => state.client?.invoke('flush')

export const openLocalFile = async (): Promise<void> => {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.json,application/json'
  input.onchange = async () => {
    const file = input.files?.[0]
    if (!file) return
    try {
      if (file.size > 64 * 1024 * 1024) throw new Error('Session replay file is too large')
      const session = JSON.parse(await file.text())
      await configure({ endpoint: '', local: false, upload: false })
      await mountPlayer(document.body, { source: { session }, workerUrl })
    } catch (error) {
      console.error(error)
    }
  }
  input.click()
}

// Replay gets its own layout before any editor, extension or shared worker starts.
export const initializeLayout = async (href: string): Promise<boolean> => {
  const url = new URL(href)
  const localId = url.searchParams.get('replayId')
  if (!localId && !url.searchParams.has('sessionReplay')) return false
  if (localId) await mountPlayer(document.body, { source: { localId }, workerUrl })
  else {
    const button = document.createElement('button')
    button.textContent = 'Open session replay file'
    button.onclick = () => {
      void openLocalFile()
    }
    document.body.replaceChildren(button)
  }
  return true
}
