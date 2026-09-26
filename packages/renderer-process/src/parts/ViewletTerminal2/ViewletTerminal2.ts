import * as Assert from '../Assert/Assert.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.ts'

const defaultColumns = 80
const defaultRows = 24
const terminalAnsiColors = [
  ['black', 'Black'],
  ['red', 'Red'],
  ['green', 'Green'],
  ['yellow', 'Yellow'],
  ['blue', 'Blue'],
  ['magenta', 'Magenta'],
  ['cyan', 'Cyan'],
  ['white', 'White'],
  ['brightBlack', 'BrightBlack'],
  ['brightRed', 'BrightRed'],
  ['brightGreen', 'BrightGreen'],
  ['brightYellow', 'BrightYellow'],
  ['brightBlue', 'BrightBlue'],
  ['brightMagenta', 'BrightMagenta'],
  ['brightCyan', 'BrightCyan'],
  ['brightWhite', 'BrightWhite'],
]

const getTerminalTheme = () => {
  const getColor = (key) => getComputedStyle(document.documentElement).getPropertyValue(`--${key}`).trim()
  const theme: Record<string, string> = {
    background: 'rgba(0, 0, 0, 0)',
  }
  const foreground = getColor('TerminalForeground') || getColor('WorkbenchForeground')
  if (foreground) {
    theme.foreground = foreground
  }
  for (const [xtermColor, themeColor] of terminalAnsiColors) {
    const color = getColor(`TerminalAnsi${themeColor}`)
    if (color) {
      theme[xtermColor] = color
    }
  }
  return theme
}

const createTerminal = async (uid) => {
  const [{ FitAddon }, { WebLinksAddon }, { Terminal }] = await Promise.all([
    import('@xterm/addon-fit'),
    import('@xterm/addon-web-links'),
    import('@xterm/xterm'),
  ])
  const terminal = new Terminal({
    allowTransparency: true,
    altClickMovesCursor: false,
    cols: defaultColumns,
    convertEol: true,
    cursorBlink: true,
    rows: defaultRows,
    theme: getTerminalTheme(),
  })
  const fitAddon = new FitAddon()
  terminal.loadAddon(fitAddon)
  terminal.loadAddon(
    new WebLinksAddon((event, uri) => {
      event.preventDefault()
      ForwardCommand.handleLink(uid, uri)
    }),
  )
  return {
    fitAddon,
    terminal,
  }
}

const flushPendingData = (state) => {
  const { pendingData, terminal } = state
  for (const data of pendingData) {
    if (data?.restore) restore(state, data.restore)
    else terminal.write(data)
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
  const { fitAddon, terminal } = await createTerminal(uid)
  if (state.disposed) {
    terminal.dispose()
    return
  }
  const inputDisposable = terminal.onData((data) => {
    ForwardCommand.handleInput(uid, data)
  })
  const resizeDisposable = terminal.onResize(({ cols, rows }) => {
    if (state.restoring) return
    ForwardCommand.resize(uid, {
      columns: cols,
      rows,
    })
  })
  const updateTheme = () => {
    terminal.options.theme = getTerminalTheme()
  }
  window.addEventListener('color-theme-changed', updateTheme)
  updateTheme()
  terminal.open(state.$Viewlet)
  const resizeObserver = new ResizeObserver(() => {
    if (state.restoring) return
    fitAddon.fit()
    focusIfConnected(state)
  })
  resizeObserver.observe(state.$Viewlet)
  state.fitAddon = fitAddon
  state.resizeObserver = resizeObserver
  state.terminal = terminal
  state.disposables = [inputDisposable, resizeDisposable, { dispose: () => window.removeEventListener('color-theme-changed', updateTheme) }]
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
    restoring: false,
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

export const restore = (state, snapshot) => {
  if (state.disposed) return
  const { columns, data, rows } = snapshot
  if (
    !Number.isSafeInteger(columns) ||
    !Number.isSafeInteger(rows) ||
    columns < 2 ||
    columns > 500 ||
    rows < 1 ||
    rows > 200 ||
    typeof data !== 'string'
  ) {
    throw new Error('Invalid terminal snapshot')
  }
  const { terminal } = state
  if (!terminal) {
    state.pendingData.push({ restore: snapshot })
    return
  }
  state.restoring = true
  terminal.reset()
  terminal.resize(columns, rows)
  terminal.write(data, () => {
    if (state.disposed) return
    state.restoring = false
    state.fitAddon.fit()
    focusIfConnected(state)
  })
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
