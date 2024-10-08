import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
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
  applyUidWorkaround($Viewlet)
}

const applyUidWorkaround = (element: HTMLElement) => {
  // TODO editor widget uids are not available in renderer worker
  // TODO send editor events directly to editor worker
  const editor = document.querySelector('.Viewlet.Editor') as HTMLElement
  if (!editor) {
    throw new Error('no editor found')
  }
  const editorUid = ComponentUid.get(editor)
  ComponentUid.set(element, editorUid)
}

export const appendWidget = (state) => {
  const { $Viewlet } = state
  Widget.append($Viewlet)
}
