import type { ReplayClient } from '@lvce-editor/session-replay-worker/api'
import { createClient, mountPlayer, observe, serializeMessage } from '@lvce-editor/session-replay-worker/api'

const state: { client: ReplayClient | undefined; stopObserving: (() => void) | undefined; lastError: string; inFlight: number } = {
  client: undefined,
  inFlight: 0,
  lastError: '',
  stopObserving: undefined,
}
const attached = new WeakSet<object>()
const workerUrl = new URL('sessionReplayWorkerMain.js', import.meta.url)

const report = (error: unknown): void => {
  const message = error instanceof Error ? error.message : String(error)
  state.lastError = message
  state.stopObserving?.()
  state.stopObserving = undefined
  console.warn(`Session replay: ${message}`)
}

export const record = (direction: string, message: unknown): void => {
  if (!state.client || state.lastError) return
  if (state.inFlight >= 500) {
    report(new Error('Recording cannot keep up with renderer messages'))
    return
  }
  try {
    const value = serializeMessage({ direction, message })
    state.inFlight++
    void state.client
      .invoke('record', 'message', value)
      .catch(report)
      .finally(() => {
        state.inFlight--
      })
  } catch (error) {
    report(error as Error)
  }
}

// Observe the actual transports, including messages on direct view-worker ports.
// The recording path never changes or delays the original message or transfer list.
export const attach = (rpc: any): void => {
  const ipc = rpc.ipc
  if (!ipc || attached.has(ipc)) return
  attached.add(ipc)
  const ignoredReplies = { received: new Set<unknown>(), sent: new Set<unknown>() }
  const trace = (direction: 'received' | 'sent', message: any): void => {
    if (message?.method?.startsWith('SessionReplay.')) {
      if (message.id !== undefined) ignoredReplies[direction === 'received' ? 'sent' : 'received'].add(message.id)
      return
    }
    if (message && ('result' in message || 'error' in message) && ignoredReplies[direction].delete(message.id)) return
    record(direction, message)
  }
  if (typeof ipc.addEventListener === 'function') {
    ipc.addEventListener('message', (event: MessageEvent) => trace('received', ipc.getData ? ipc.getData(event) : event.data))
  }
  for (const name of ['send', 'sendAndTransfer']) {
    if (typeof ipc[name] !== 'function') continue
    const original = ipc[name].bind(ipc)
    ipc[name] = (...args: unknown[]) => {
      trace('sent', args[0])
      return original(...args)
    }
  }
}

export const configure = async (options: { local: boolean; upload: boolean; endpoint: string; token?: string }): Promise<string> => {
  state.stopObserving?.()
  state.stopObserving = undefined
  if (state.client) {
    try {
      await state.client.invoke('stop')
    } catch {
      /* Preserve already saved local data when an upload is unavailable. */
    }
    state.client.dispose()
    state.client = undefined
  }
  state.lastError = ''
  if (!options.local && !options.upload) return ''
  const next = createClient(workerUrl)
  try {
    const id = await next.invoke('start', options)
    state.client = next
    state.stopObserving = observe(document, (type, data) => next.invoke('record', type, data), report)
    return id
  } catch (error) {
    next.dispose()
    throw error
  }
}

export const getSession = async () => {
  if (!state.client) throw new Error('Session replay is disabled in settings')
  return state.client.invoke('export')
}

export const getStatus = async () => {
  if (!state.client) return { enabled: false, error: state.lastError }
  return { enabled: true, ...(await state.client.invoke('status')), captureError: state.lastError }
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
