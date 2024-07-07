import * as FunctionalPointerEvents from '../FunctionalPointerEvents/FunctionalPointerEvents.ts'

export const returnValue = true

export const handleSashPointerDown = FunctionalPointerEvents.create(
  (event) => {
    const { clientX, clientY } = event
    return ['handleSashPointerDown', clientX, clientY]
  },
  (event) => {
    const { clientX, clientY } = event
    return ['handleSashPointerMove', clientX, clientY]
  },
  (event) => {
    const { clientX, clientY } = event
    return ['handleSashPointerUp', clientX, clientY]
  },
)
