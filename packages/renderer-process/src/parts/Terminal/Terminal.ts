import { createOffscreenTerminalDom } from 'termterm'

export const create = ({ $Element, ...options }) => {
  const terminal = createOffscreenTerminalDom($Element, options)
  return terminal
}

export const close = () => {}

// export const

export const write = (state, text) => {
  // state.terminal.write(text)
}

export const wrapTerminalCommand = (id) => {}
