import * as Event from '../Event/Event.ts'
import * as FunctionalPointerEvents from '../FunctionalPointerEvents/FunctionalPointerEvents.ts'

export const handleClickAt = (event) => {
  const { clientX, clientY } = event
  return ['handleClickAt', clientX, clientY]
}

export const handleLoad = (event) => {
  return ['handleLoad']
}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  return ['handleContextMenu', button, clientX, clientY]
}

export const handleSashCornerPointerDown = FunctionalPointerEvents.create(
  (event) => {
    const { clientX, clientY } = event
    return ['handleSashCornerPointerDown', clientX, clientY]
  },
  (event) => {
    const { clientX, clientY } = event
    return ['handleSashCornerPointerMove', clientX, clientY]
  },
  (event) => {
    const { clientX, clientY } = event
    return ['handleSashCornerPointerUp', clientX, clientY]
  },
)

export const returnValue = true
