import { Terminal } from '@xterm/xterm'
import * as Assert from '../Assert/Assert.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.ts'

const defaultColumns = 80
const defaultRows = 24

const createTerminal = () => {
  return new Terminal({
    cols: defaultColumns,
    convertEol: true,
    cursorBlink: true,
    rows: defaultRows,
  })
}

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Terminal XtermTerminal'
  return {
    $Viewlet,
    disposables: [],
    terminal: undefined,
  }
}

export const setTerminal = (state, uid) => {
  if (state.terminal) {
    return
  }
  const terminal = createTerminal()
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
  state.terminal = terminal
  state.disposables = [inputDisposable, resizeDisposable]
}

export const write = (state, data) => {
  const { terminal } = state
  if (!terminal) {
    return
  }
  terminal.write(data)
}

export const focus = (state) => {
  Assert.object(state)
  const { terminal } = state
  if (!terminal) {
    return
  }
  terminal.focus()
}

export const handleMouseDown = (state) => {
  focus(state)
}

export const dispose = (state) => {
  for (const disposable of state.disposables) {
    disposable.dispose()
  }
  state.disposables = []
  state.terminal?.dispose()
  state.terminal = undefined
}
