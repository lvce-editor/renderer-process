const toSimpleTouch = (touch) => {
  return {
    identifier: touch.identifier,
    x: touch.clientX,
    y: touch.clientY,
  }
}

const toSimpleTouches = (touches) => {
  return Array.from(touches).map(toSimpleTouch)
}

/**
 * @param {TouchEvent} event
 */
export const toSimpleTouchEvent = (event) => {
  const touches = toSimpleTouches(event.touches)
  const changedTouches = toSimpleTouches(event.changedTouches)
  return {
    changedTouches,
    touches,
  }
}
