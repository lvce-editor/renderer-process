import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as Event from '../Event/Event.ts'
import * as ViewletExplorerFunctions from './ViewletExplorerFunctions.ts'
// TODO put drop into separate module and use executeCommand to call it

// TODO drag and drop should be loaded on demand

export const handleFocus = (event) => {
  const { target, isTrusted } = event
  if (!isTrusted || target.className === 'InputBox') {
    return
  }
  const uid = ComponentUid.fromEvent(event)
  ViewletExplorerFunctions.handleFocus(uid)
}

export const handleBlur = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletExplorerFunctions.handleBlur(uid)
}

export const handleClick = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletExplorerFunctions.handleClickAt(uid, button, clientX, clientY)
}

export const handleClickOpenFolder = (event) => {
  Event.preventDefault(event)
  const uid = ComponentUid.fromEvent(event)
  ViewletExplorerFunctions.handleClickOpenFolder(uid)
}

export const handlePointerDown = (event) => {
  const { button, clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletExplorerFunctions.handlePointerDown(uid, button, clientX, clientY)
}

export const handleMouseEnter = (event) => {
  // const $Target = event.target
  // const index = findIndex($Target)
  // if (index === -1) {
  //   return
  // }
  // RendererWorker.send(
  //   /* Explorer.handleMouseEnter */ 'Explorer.handleMouseEnter',
  //   /* index */ index
  // )
}

export const handleMouseLeave = (event) => {
  // const $Target = event.target
  // const index = findIndex($Target)
  // if (index === -1) {
  //   return
  // }
  // RendererWorker.send(
  //   /* Explorer.handleMouseLeave */ 'Explorer.handleMouseLeave',
  //   /* index */ index
  // )
}

export const handleEditingInput = (event) => {
  const { target } = event
  const { value } = target
  const uid = ComponentUid.fromEvent(event)
  ViewletExplorerFunctions.updateEditingValue(uid, value)
}

export * from '../ContextMenuEvents/ContextMenuEvents.ts'
export * from '../DragEvents/DragEvents.ts'
export * from '../VirtualListEvents/VirtualListEvents.ts'
