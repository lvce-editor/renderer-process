import { Terminal } from '@xterm/xterm'

export const create = () => {
  const $Viewlet = document.createElement('div')
  const term = new Terminal()
  term.open($Viewlet)
  term.write('Hello from \u001B[1;3;31mxterm.js\u001B[0m $ ')
  return {
    $Viewlet,
  }
}
