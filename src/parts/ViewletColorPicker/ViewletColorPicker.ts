import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as Widget from '../Widget/Widget.ts'
export * as Events from './ViewletColorPickerEvents.ts'
import * as ComponentUid from '../ComponentUid/ComponentUid.ts'

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
  // TODO editor widget uids are not available in renderer worker
  // TODO send editor events directly to editor worker
  const editor = document.querySelector('.Viewlet.Editor') as HTMLElement
  if (!editor) {
    throw new Error('no editor found')
  }
  const editorUid = ComponentUid.get(editor)
  console.log({ editorUid })
  ComponentUid.set($Viewlet, editorUid)
  const $Root = VirtualDom.render(dom)
  // @ts-expect-error
  $Viewlet.replaceChildren(...$Root.firstChild.childNodes)
  Widget.append($Viewlet)
}

export const appendWidget = (state) => {
  const { $Viewlet } = state
  Widget.append($Viewlet)
}
