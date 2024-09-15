import * as GetEventListeneroptions from '../GetEventListenerOptions/GetEventListenerOptions.ts'
import * as GetWrappedListener from '../GetWrappedListener/GetWrappedListener.ts'

export const attachEvent = ($Node, eventMap, key, value) => {
  const listener = eventMap[value]
  if (!listener) {
    console.warn('listener not found', value)
    return
  }
  // console.log({ value })
  let options = GetEventListeneroptions.getEventListenerOptions(key)
  const wrapped = GetWrappedListener.getWrappedListener(listener, eventMap.returnValue)
  // console.log({ value, options })
  if (key === 'wheel' && !options?.passive) {
    console.log({ value, options, key })
  }
  if (key === 'wheel') {
    options = { passive: true }
    // options.passive=true
  }
  $Node.addEventListener(key, wrapped, options)
}
