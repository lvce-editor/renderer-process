import * as SetBounds from '../SetBounds/SetBounds.ts'

export const setBounds = (state, x, y, width, height) => {
  const { $Viewlet } = state
  SetBounds.setWidth($Viewlet, width)
  SetBounds.setXAndYTransform($Viewlet, x, -y)
}

export * as Events from './ViewletEditorHoverEvents.ts'
