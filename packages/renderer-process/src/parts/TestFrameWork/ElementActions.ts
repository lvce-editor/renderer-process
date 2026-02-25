import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as GetEventClass from '../GetEventClass/GetEventClass.ts'

export const mouseEvent = (element, eventType, options) => {
  // Get the element's bounding rect and calculate center position
  const rect = element.getBoundingClientRect()
  const centerX = rect.left + rect.width / 2
  const centerY = rect.top + rect.height / 2

  // Ensure clientX and clientY are set if not provided
  const eventOptions = {
    ...options,
    clientX: options?.clientX ?? centerX,
    clientY: options?.clientY ?? centerY,
  }

  const event = new MouseEvent(eventType, eventOptions)
  element.dispatchEvent(event)
}

export const mouseDown = (element, options) => {
  mouseEvent(element, DomEventType.MouseDown, options)
}

export const mouseUp = (element, options) => {
  mouseEvent(element, DomEventType.MouseUp, options)
}

export const contextMenu = (element, options) => {
  mouseEvent(element, DomEventType.ContextMenu, options)
}

export const click = (element, options) => {
  mouseDown(element, options)
  mouseEvent(element, DomEventType.Click, options)
  mouseUp(element, options)
  if (options.button === 2 /* right */) {
    contextMenu(element, options)
  }
}

export const hover = (element, options) => {
  mouseEvent(element, DomEventType.MouseEnter, options)
}

export const type = (element, options) => {
  element.value = options.text
}

export const keyboardEvent = (element, eventType, options) => {
  const event = new KeyboardEvent(eventType, options)
  element.dispatchEvent(event)
}

export const keyDown = (element, options) => {
  keyboardEvent(element, DomEventType.KeyDown, options)
}

export const keyUp = (element, options) => {
  keyboardEvent(element, DomEventType.KeyUp, options)
}

export const dispatchEvent = (element, options) => {
  const EventClass = GetEventClass.getEventClass(options.type)
  const event = new EventClass(options.type, options.init)
  element.dispatchEvent(event)
}
