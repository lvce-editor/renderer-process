import * as DomEventType from '../DomEventType/DomEventType.ts'

export const getEventClass = (eventType) => {
  switch (eventType) {
    case DomEventType.Wheel:
      return WheelEvent
    case DomEventType.PointerDown:
    case DomEventType.PointerUp:
    case DomEventType.PointerMove:
      return PointerEvent
    default:
      return Event
  }
}
