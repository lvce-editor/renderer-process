import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const startTracking = ($Target, pointerId, handlePointerMove, handlePointerUp) => {
  $Target.setPointerCapture(pointerId)
  $Target.addEventListener(DomEventType.PointerMove, handlePointerMove)
  // TODO use pointerlost event instead
  $Target.addEventListener(DomEventType.PointerUp, handlePointerUp)
}

const stopTracking = ($Target, pointerId, handlePointerMove, handlePointerUp) => {
  $Target.releasePointerCapture(pointerId)
  $Target.removeEventListener(DomEventType.PointerMove, handlePointerMove)
  // TODO use pointerlost event instead
  $Target.removeEventListener(DomEventType.PointerUp, handlePointerUp)
}

export const create = (pointerDown, pointerMove, pointerUp) => {
  const shared = (fn, event) => {
    const message = fn(event)
    if (!message || message.length === 0) {
      return
    }
    const uid = ComponentUid.fromEvent(event)
    RendererWorker.send('Viewlet.executeViewletCommand', uid, ...message)
  }
  const handlePointerMove = (event) => {
    shared(pointerMove, event)
  }
  const handlePointerUp = (event) => {
    const { target, pointerId } = event
    stopTracking(target, pointerId, handlePointerMove, handlePointerUp)
    shared(pointerUp, event)
  }
  const handlePointerDown = (event) => {
    const { target, pointerId } = event
    startTracking(target, pointerId, handlePointerMove, handlePointerUp)
    shared(pointerDown, event)
    return []
  }
  return handlePointerDown
}
