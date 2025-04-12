import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as Event from '../Event/Event.ts'
import * as ExecuteViewletCommand from '../ExecuteViewletCommand/ExecuteViewletCommand.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.ts'

export const handleFocusIn = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleFocusIn(uid)
}

export const handleBlur = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ExecuteViewletCommand.executeViewletCommand(uid, 'EditorRename.handleBlur')
}

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  const uid = ComponentUid.fromEvent(event)
  ExecuteViewletCommand.executeViewletCommand(uid, 'EditorRename.handleInput', value)
}
