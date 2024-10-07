import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as Widget from '../Widget/Widget.ts'

export const create = () => {
  console.log('create details')
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet EditorCompletionDetails'
  $Viewlet.id = 'CompletionsDetails'
  return {
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  // TODO
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  const $Root = VirtualDom.render(dom)
  // @ts-expect-error
  $Viewlet.replaceChildren(...$Root.firstChild.childNodes)
  Widget.append($Viewlet)
}

export const dispose = (state) => {
  Widget.remove(state.$Viewlet)
}

export const setBounds = (state, x, y, width, height) => {
  const { $Viewlet } = state
  SetBounds.setBounds($Viewlet, x, y, width, height)
}
