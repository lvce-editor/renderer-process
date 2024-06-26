import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as ViewletDebugConsoleEvents from './ViewletDebugConsoleEvents.ts'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet DebugConsole'
  return {
    $Viewlet,
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  VirtualDom.renderInto($Viewlet, dom, ViewletDebugConsoleEvents)
}
