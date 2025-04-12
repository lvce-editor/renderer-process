import * as AttachEvent from '../AttachEvent/AttachEvent.ts'

export const attachEventsFunctional = ($Node, eventMap) => {
  for (const [key] of Object.entries(eventMap)) {
    if (key === 'returnValue') {
      continue
    }
    AttachEvent.attachEvent($Node, eventMap, key, key)
  }
}
