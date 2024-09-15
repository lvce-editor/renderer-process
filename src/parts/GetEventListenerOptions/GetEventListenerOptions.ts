import * as DomEventType from '../DomEventType/DomEventType.ts'

export const getEventListenerOptions = (eventName: string) => {
  switch (eventName) {
    case DomEventType.Wheel:
      return {
        passive: true,
      }
    default:
      return undefined
  }
}
