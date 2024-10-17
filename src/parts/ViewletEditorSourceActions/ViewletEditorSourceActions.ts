import * as RememberFocus from '../RememberFocus/RememberFocus.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as Widget from '../Widget/Widget.ts'
import * as Events from './ViewletEditorSourceActionsEvents.ts'

export const setBounds = (state, x, y) => {
  const { $Viewlet } = state
  SetBounds.setXAndYTransform($Viewlet, x, -y)
}

export const appendWidget = (state) => {
  const { $Viewlet } = state
  Widget.append($Viewlet)
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  RememberFocus.rememberFocus($Viewlet, dom, Events, 0)
}
