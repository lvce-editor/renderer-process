import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as Event from '../Event/Event.ts'
import * as ForwardCommand from '../ForwardCommand/ForwardCommand.ts'

export * from '../DragEvents/DragEvents.ts'

export const handleContextMenu = (event) => {
  if (event.defaultPrevented) {
    return
  }
  Event.preventDefault(event)
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ForwardCommand.handleContextMenu(uid, clientX, clientY)
}
