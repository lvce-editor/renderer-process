import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as PointerEvents from '../PointerEvents/PointerEvents.ts'
import * as ViewletKeyBindingsFunctions from './ViewletKeyBindingsFunctions.ts'

export const handleResizerPointerMove = (event) => {
  const { clientX } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletKeyBindingsFunctions.handleResizerMove(uid, clientX)
}

// TODO use lostpointercapture event instead
export const handleResizerPointerUp = (event) => {
  const { target, pointerId } = event
  PointerEvents.stopTracking(target, pointerId, handleResizerPointerMove, handleResizerPointerUp)
}

export const handleResizerPointerDown = (event) => {
  const { target, pointerId, clientX } = event
  PointerEvents.startTracking(target, pointerId, handleResizerPointerMove, handleResizerPointerUp)
  const id = target.nextSibling ? 1 : 2
  const uid = ComponentUid.fromEvent(event)
  ViewletKeyBindingsFunctions.handleResizerClick(uid, id, clientX)
}

const getPointerDownFunction = (event) => {
  const { target } = event
  switch (target.className) {
    case 'Resizer':
      return handleResizerPointerDown
    default:
      return undefined
  }
}

export const handlePointerDown = (event) => {
  const pointerDownFunction = getPointerDownFunction(event)
  if (!pointerDownFunction) {
    return
  }
  pointerDownFunction(event)
}
