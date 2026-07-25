import type { Rpc } from '@lvce-editor/rpc'

type Direction = 'received' | 'sent'

interface TraceEntry {
  readonly direction: Direction
  readonly method: string
  readonly params: readonly unknown[]
  readonly timestamp: number
}

interface TraceableIpc extends EventTarget {
  readonly getData: (event: MessageEvent) => unknown
}

interface TraceableRpc extends Rpc {
  readonly ipc?: TraceableIpc
}

const selector = 'script.RendererWorkerTrace'

const state: {
  enabled: boolean
  entries: TraceEntry[]
} = {
  enabled: false,
  entries: [],
}

const serialize = (value: readonly unknown[]): readonly unknown[] => {
  const seen = new WeakSet<object>()
  const text = JSON.stringify(value, (_key, currentValue: unknown) => {
    if (typeof currentValue === 'bigint') {
      return `${currentValue}n`
    }
    if (typeof currentValue !== 'object' || currentValue === null) {
      return currentValue
    }
    if (seen.has(currentValue)) {
      return '[Circular]'
    }
    seen.add(currentValue)
    if (currentValue instanceof ArrayBuffer) {
      return {
        byteLength: currentValue.byteLength,
        type: 'ArrayBuffer',
      }
    }
    if (ArrayBuffer.isView(currentValue)) {
      return {
        byteLength: currentValue.byteLength,
        type: currentValue.constructor.name,
      }
    }
    if (currentValue instanceof Error) {
      return {
        message: currentValue.message,
        name: currentValue.name,
        stack: currentValue.stack,
      }
    }
    if (currentValue.constructor?.name === 'MessagePort') {
      return {
        type: 'MessagePort',
      }
    }
    return currentValue
  })
  return JSON.parse(text)
}

const isCommand = (value: unknown): value is { method: string; params?: readonly unknown[] } => {
  return typeof value === 'object' && value !== null && 'method' in value && typeof value.method === 'string'
}

export const initialize = (search: string): void => {
  const searchParams = new URLSearchParams(search)
  state.enabled = searchParams.has('traceRendererWorker')
  state.entries = []
}

export const record = (direction: Direction, method: string, params: readonly unknown[]): void => {
  if (!state.enabled) {
    return
  }
  state.entries.push({
    direction,
    method,
    params: serialize(params),
    timestamp: performance.now(),
  })
}

export const listen = (rpc: Rpc): void => {
  if (!state.enabled) {
    return
  }
  const ipc = (rpc as TraceableRpc).ipc
  if (!ipc) {
    return
  }
  ipc.addEventListener('message', (event) => {
    const message = ipc.getData(event as MessageEvent)
    if (isCommand(message)) {
      record('received', message.method, message.params || [])
    }
  })
}

export const exportToDom = (): void => {
  if (!state.enabled) {
    return
  }
  const existing = document.querySelector<HTMLScriptElement>(selector)
  const script = existing || document.createElement('script')
  script.className = 'RendererWorkerTrace'
  script.type = 'application/json'
  script.textContent = JSON.stringify({
    entries: state.entries,
    version: 1,
  })
  if (!existing) {
    document.body.append(script)
  }
}

export const scheduleExport = (): void => {
  if (!state.enabled) {
    return
  }
  queueMicrotask(exportToDom)
}
