import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as RememberFocus from '../RememberFocus/RememberFocus.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as Widget from '../Widget/Widget.ts'
import * as ViewletFindWidgetEvents from './ViewletFindWidgetEvents.ts'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet FindWidget'
  $Viewlet.role = AriaRoles.Group
  return {
    $Viewlet,
  }
}

export const focus = (state) => {
  const { $Viewlet } = state
  const $InputBox = $Viewlet.querySelector('.MultilineInputBox')
  if (!$InputBox) {
    return
  }
  $InputBox.focus()
}

export const setValue = (state, value) => {
  const { $Viewlet } = state
  const $InputBox = $Viewlet.querySelector('.MultilineInputBox')
  if (!$InputBox) {
    return
  }
  $InputBox.value = value
}

export const appendWidget = (state) => {
  const { $Viewlet } = state
  Widget.append($Viewlet)
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  RememberFocus.rememberFocus($Viewlet, dom, ViewletFindWidgetEvents, 0)
}

export const setBounds = (state, x, y, width, height) => {
  const { $Viewlet } = state
  SetBounds.setBounds($Viewlet, x, y, width, height)
}

export const Events = ViewletFindWidgetEvents
