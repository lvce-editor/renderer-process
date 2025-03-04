import * as Event from '../Event/Event.ts'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  return ['FindWidget.handleInput', value]
}

export const handleClickClose = (event) => {
  Event.preventDefault(event)
  return ['FindWidget.close']
}

export const handleClickPreviousMatch = (event) => {
  Event.preventDefault(event)
  return ['FindWidget.focusPrevious']
}

export const handleClickNextMatch = (event) => {
  Event.preventDefault(event)
  return ['FindWidget.focusNext']
}

export const handleClickReplace = (event) => {
  Event.preventDefault(event)
  return ['FindWidget.replace']
}

export const handleClickReplaceAll = (event) => {
  Event.preventDefault(event)
  return ['FindWidget.replaceAll']
}

export const handleClickToggleReplace = (event) => {
  Event.preventDefault(event)
  return ['FindWidget.toggleReplace']
}

export const handleInputBlur = (event) => {
  return ['FindWidget.handleBlur']
}

export const handleReplaceInput = (event) => {
  const { target } = event
  const { value } = target
  return ['FindWidget.handleReplaceInput', value]
}

export const handleReplaceFocus = (event) => {
  return ['FindWidget.handleReplaceFocus']
}

export const handleFocus = (event) => {
  return ['FindWidget.handleFocus']
}

export const handleToggleReplaceFocus = (event) => {
  return ['FindWidget.handleToggleReplaceFocus']
}

export const handleFocusPrevious = (event) => {
  return ['FindWidget.handleFocusPrevious']
}

export const handleFocusNext = (event) => {
  return ['FindWidget.handleFocusNext']
}

export const handleFocusClose = (event) => {
  return ['FindWidget.handleFocusClose']
}

export const handleFocusReplaceAll = (event) => {
  return ['FindWidget.handleFocusReplaceAll']
}

export const returnValue = true
