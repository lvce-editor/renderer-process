import * as DomEventType from '../DomEventType/DomEventType.ts'

export const getEventClass = (eventType) => {
  switch (eventType) {
    case DomEventType.PointerDown:
    case DomEventType.PointerMove:
    case DomEventType.PointerUp:
      return PointerEvent
    case DomEventType.Wheel:
      return WheelEvent
    default:
      return Event
  }
}
