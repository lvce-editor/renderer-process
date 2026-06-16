import { Terminal } from '@xterm/xterm'

export const create = () => {
  const $Viewlet = document.createElement('div')
  const term = new Terminal()
  term.open($Viewlet)
  term.write('Hello from \u{1B}[1;3;31mxterm.js\u{1B}[0m $ ')
  return {
    $Viewlet,
  }
}
