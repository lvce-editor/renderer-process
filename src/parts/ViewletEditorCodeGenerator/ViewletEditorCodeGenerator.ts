import * as ApplyUidWorkaround from '../ApplyUidWorkaround/ApplyUidWorkaround.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as FocusSource from '../FocusSource/FocusSource.ts'
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

export const focus = (state, key, source) => {
  if (!key) {
    return
  }
  if (source !== FocusSource.Script) {
    return
  }
  const { $Viewlet } = state
  const $Element = $Viewlet.querySelector(key)
  if (!$Element) {
    console.warn(`element not found: ${key}`)
    return
  }
  $Element.focus()
  ApplyUidWorkaround.applyUidWorkaround($Viewlet)
}

export * as Events from './ViewletEditorCodeGeneratorEvents.ts'
