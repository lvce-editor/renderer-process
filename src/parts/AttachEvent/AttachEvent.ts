import * as GetEventListenerOptions from '../GetEventListenerOptions/GetEventListenerOptions.ts'
import * as GetWrappedListener from '../GetWrappedListener/GetWrappedListener.ts'

export const attachEvent = ($Node, eventMap, key, value) => {
  const listener = eventMap[value]
  if (!listener) {
    console.warn('listener not found', value)
    return
  }
  const options = GetEventListenerOptions.getEventListenerOptions(key)
  const wrapped = GetWrappedListener.getWrappedListener(listener, eventMap.returnValue)
  $Node.addEventListener(key, wrapped, options)
}
