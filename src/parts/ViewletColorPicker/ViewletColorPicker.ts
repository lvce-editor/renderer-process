import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as Widget from '../Widget/Widget.ts'
export * as Events from './ViewletColorPickerEvents.ts'

export const setColor = (state, color) => {
  const { $Viewlet } = state
  $Viewlet.style.setProperty('--ColorPickerColor', color)
}

export const setOffsetX = (state, offsetX) => {
  const { $Viewlet } = state
  const $ColorPickerSliderThumb = $Viewlet.querySelector('.ColorPickerSliderThumb')
  SetBounds.setXAndYTransform($ColorPickerSliderThumb, offsetX, 0)
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  const $Root = VirtualDom.render(dom)
  // @ts-expect-error
  $Viewlet.replaceChildren(...$Root.firstChild.childNodes)
  Widget.append($Viewlet)
}

export const appendWidget = (state) => {
  const { $Viewlet } = state
  Widget.append($Viewlet)
}
