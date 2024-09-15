import * as DomEventType from '../DomEventType/DomEventType.ts'

export const getEventListenerOptions = (eventName: string) => {
  // console.log({ eventName })
  switch (eventName) {
    case DomEventType.Wheel:
      return {
        passive: true,
      }
    default:
      return undefined
  }
}
