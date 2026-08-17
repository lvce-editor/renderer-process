import * as Assert from '../Assert/Assert.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.ts'

const defaultColumns = 80
const defaultRows = 24

const createTerminal = async () => {
  const [{ FitAddon }, { Terminal }] = await Promise.all([import('@xterm/addon-fit'), import('@xterm/xterm')])
  const terminal = new Terminal({
    allowTransparency: true,
    cols: defaultColumns,
    convertEol: true,
    cursorBlink: true,
    rows: defaultRows,
    theme: {
      background: 'rgba(0, 0, 0, 0)',
    },
  })
  const fitAddon = new FitAddon()
  terminal.loadAddon(fitAddon)
  return {
    fitAddon,
    terminal,
  }
}

const flushPendingData = (state) => {
  const { pendingData, terminal } = state
  for (const data of pendingData) {
    terminal.write(data)
  }
  pendingData.length = 0
}

const focusIfConnected = (state) => {
  const { $Viewlet, pendingFocus, terminal } = state
  if (!pendingFocus || !terminal || !$Viewlet.isConnected) {
    return
  }
  state.pendingFocus = false
  terminal.focus()
}

const mountTerminal = async (state, uid) => {
  const { fitAddon, terminal } = await createTerminal()
  if (state.disposed) {
    terminal.dispose()
    return
  }
  const inputDisposable = terminal.onData((data) => {
    ForwardCommand.handleInput(uid, data)
  })
  const resizeDisposable = terminal.onResize(({ cols, rows }) => {
    ForwardCommand.resize(uid, {
      columns: cols,
      rows,
    })
  })
  terminal.open(state.$Viewlet)
  const resizeObserver = new ResizeObserver(() => {
    fitAddon.fit()
    focusIfConnected(state)
  })
  resizeObserver.observe(state.$Viewlet)
  state.fitAddon = fitAddon
  state.resizeObserver = resizeObserver
  state.terminal = terminal
  state.disposables = [inputDisposable, resizeDisposable]
  fitAddon.fit()
  flushPendingData(state)
  focusIfConnected(state)
}

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Terminal XtermTerminal'
  return {
    $Viewlet,
    disposables: [],
    disposed: false,
    fitAddon: undefined,
    mountPromise: undefined,
    mouseDownListener: undefined,
    pendingData: [],
    pendingFocus: false,
    resizeObserver: undefined,
    terminal: undefined,
  }
}

export const setTerminal = (state, uid) => {
  if (state.terminal) {
    return Promise.resolve()
  }
  if (!state.mountPromise) {
    state.mountPromise = mountTerminal(state, uid)
  }
  return state.mountPromise
}

export const write = (state, data) => {
  const { terminal } = state
  if (!terminal) {
    if (!state.disposed) {
      state.pendingData.push(data)
    }
    return
  }
  terminal.write(data)
}

export const focus = (state) => {
  Assert.object(state)
  const { terminal } = state
  if (!terminal || !state.$Viewlet.isConnected) {
    state.pendingFocus = true
    return
  }
  state.pendingFocus = false
  terminal.focus()
}

export const handleMouseDown = (state) => {
  focus(state)
}

export const attachEvents = (state) => {
  if (state.mouseDownListener) {
    return
  }
  state.mouseDownListener = () => {
    handleMouseDown(state)
  }
  state.$Viewlet.addEventListener('mousedown', state.mouseDownListener)
}

export const dispose = (state) => {
  state.disposed = true
  if (state.mouseDownListener) {
    state.$Viewlet.removeEventListener('mousedown', state.mouseDownListener)
    state.mouseDownListener = undefined
  }
  for (const disposable of state.disposables) {
    disposable.dispose()
  }
  state.disposables = []
  state.pendingData.length = 0
  state.pendingFocus = false
  state.resizeObserver?.disconnect()
  state.resizeObserver = undefined
  state.terminal?.dispose()
  state.terminal = undefined
}
