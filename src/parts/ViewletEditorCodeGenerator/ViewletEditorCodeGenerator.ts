import * as ApplyUidWorkaround from '../ApplyUidWorkaround/ApplyUidWorkaround.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as Widget from '../Widget/Widget.ts'

export const setBounds = (state, x, y, width, height) => {
  const { $Viewlet } = state
  SetBounds.setBounds($Viewlet, x, y, width, height)
  ApplyUidWorkaround.applyUidWorkaround($Viewlet)
}

export const appendWidget = (state) => {
  const { $Viewlet } = state
  Widget.append($Viewlet)
}

export const dispose = (state) => {
  Widget.remove(state.$Viewlet)
}

export * as Events from './ViewletEditorCodeGeneratorEvents.ts'
