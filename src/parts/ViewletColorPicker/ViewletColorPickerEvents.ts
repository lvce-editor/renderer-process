import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as PointerEvents from '../PointerEvents/PointerEvents.ts'
import * as ViewletColorPickerFunctions from './ViewletColorPickerFunctions.ts'

const handleSliderPointerCaptureLost = (event) => {
  const { target, pointerId } = event
  PointerEvents.stopTracking(target, pointerId, handleSliderPointerMove, handleSliderPointerCaptureLost)
}

const handleSliderPointerMove = (event) => {
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletColorPickerFunctions.handleSliderPointerMove(uid, clientX - 20, clientY)
}

const handleSliderPointerDown = (event) => {
  const { clientX, clientY, target, pointerId } = event
  PointerEvents.startTracking(target, pointerId, handleSliderPointerMove, handleSliderPointerCaptureLost)
  return ['handleSliderPointerDown', clientX - 20, clientY]
}

export const handlePointerDown = (event) => {
  const { target } = event
  if (target.className === 'ColorPickerSliderThumb' || target.className === 'ColorPickerSlider') {
    return handleSliderPointerDown(event)
  }
  return []
}

export const returnValue = true
