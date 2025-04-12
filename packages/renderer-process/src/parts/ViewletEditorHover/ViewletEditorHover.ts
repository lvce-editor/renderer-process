import * as RememberFocus from '../RememberFocus/RememberFocus.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as Widget from '../Widget/Widget.ts'
import * as ViewletEditorHoverEvents from './ViewletEditorHoverEvents.ts'

export const setBounds = (state, x, y, width, height) => {
  const { $Viewlet } = state
  SetBounds.setWidth($Viewlet, width)
  SetBounds.setXAndYTransform($Viewlet, x, -y)
}

export const appendWidget = (state) => {
  const { $Viewlet } = state
  Widget.append($Viewlet)
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  RememberFocus.rememberFocus($Viewlet, dom, ViewletEditorHoverEvents, 0)
}

export * as Events from './ViewletEditorHoverEvents.ts'
