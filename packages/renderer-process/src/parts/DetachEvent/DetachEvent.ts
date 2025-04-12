import * as GetWrappedListener from '../GetWrappedListener/GetWrappedListener.ts'

export const detachEvent = ($Node, key, listener) => {
  const wrapped = GetWrappedListener.getWrappedListener(listener, true)
  $Node.removeEventListener(key, wrapped)
}
