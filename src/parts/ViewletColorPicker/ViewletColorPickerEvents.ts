import * as FunctionalPointerEvents from '../FunctionalPointerEvents/FunctionalPointerEvents.ts'

const handleOffset = 20

const handleSliderPointerDown = FunctionalPointerEvents.create(
  (event) => {
    const { clientX, clientY } = event
    return ['ColorPicker.handleSliderPointerDown', clientX - handleOffset, clientY]
  },
  (event) => {
    const { clientX, clientY } = event
    return ['ColorPicker.handleSliderPointerMove', clientX - handleOffset, clientY]
  },
  () => {
    return []
  },
)

export const handlePointerDown = (event) => {
  const { target } = event
  if (target.className === 'ColorPickerSliderThumb' || target.className === 'ColorPickerSlider') {
    return handleSliderPointerDown(event)
  }
  return []
}

export const returnValue = true
