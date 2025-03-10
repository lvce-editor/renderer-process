import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as Event from '../Event/Event.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.ts'

export const handleFocusIn = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleFocusIn(uid)
}

export const handleBlur = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleBlur(uid)
}
