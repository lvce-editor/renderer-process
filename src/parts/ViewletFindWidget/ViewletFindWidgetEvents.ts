import * as Event from '../Event/Event.ts'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  return ['handleInput', value]
}

const handleClickClose = (event) => {
  Event.preventDefault(event)
  return ['close']
}

const handleClickPreviousMatch = (event) => {
  Event.preventDefault(event)
  return ['focusPrevious']
}

const handleClickNextMatch = (event) => {
  Event.preventDefault(event)
  return ['focusNext']
}

const handleClickToggleReplace = (event) => {
  Event.preventDefault(event)
  return ['toggleReplace']
}

export const handleClick = (event) => {
  const { target } = event
  const { title } = target
  switch (title) {
    case 'Close':
      return handleClickClose(event)
    case 'Previous Match':
      return handleClickPreviousMatch(event)
    case 'Next Match':
      return handleClickNextMatch(event)
    case 'Toggle Replace':
      return handleClickToggleReplace(event)
    default:
      return []
  }
}

export const handleInputBlur = (event) => {
  return ['handleBlur']
}

export const handleFocus = (event) => {
  return ['handleFocus']
}

export const returnValue = true
