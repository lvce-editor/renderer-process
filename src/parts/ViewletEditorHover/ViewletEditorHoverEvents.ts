import * as PointerEvents from '../PointerEvents/PointerEvents.ts'
import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const returnValue = true

export const handleSashPointerMove = (event) => {
  const { clientX, clientY, target } = event
  const uid = ComponentUid.fromEvent(event)
  RendererWorker.send('EditorHover.handleSashPointerMove', uid, clientX, clientY)
}

export const handleSashPointerUp = (event) => {
  const { target, pointerId } = event
  PointerEvents.stopTracking(target, pointerId, handleSashPointerMove, handleSashPointerUp)
}

export const handleSashPointerDown = (event) => {
  console.log({ event })
  const { clientX, clientY, target, pointerId } = event
  target.setPointerCapture(pointerId)
  PointerEvents.startTracking(target, pointerId, handleSashPointerMove, handleSashPointerUp)

  return ['handleSashPointerDown', clientX, clientY]
}
