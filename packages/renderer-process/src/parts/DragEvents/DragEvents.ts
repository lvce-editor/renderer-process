import * as AllowedDragEffectType from '../AllowedDragEffectType/AllowedDragEffectType.ts'
import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as DataTransfer from '../DataTransfer/DataTransfer.ts'
import * as DragFunctions from '../DragFunctions/DragFunctions.ts'
import * as Event from '../Event/Event.ts'

export const handleDragStart = (event: DragEvent) => {
  const { dataTransfer, target } = event
  // @ts-ignore
  DataTransfer.setEffectAllowed(dataTransfer, AllowedDragEffectType.CopyMove)

  // @ts-ignore
  if (target.classList.contains('TreeItem')) {
    // @ts-ignore
    const filePath = target.title
    // @ts-ignore
    const fileName = target.textContent
    DataTransfer.setFilePath(dataTransfer, filePath, fileName)
  }
}

export const handleDragOver = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  DragFunctions.handleDragOver(uid, clientX, clientY)
}

export const handleDragEnd = (event) => {
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  DragFunctions.handleDragEnd(uid, clientX, clientY)
}

export const handleDragLeave = (event) => {
  const { clientX, clientY } = event
  const uid = ComponentUid.fromEvent(event)
  DragFunctions.handleDragLeave(uid, clientX, clientY)
}

/**
 *
 * @param {DragEvent} event
 */
export const handleDrop = (event) => {
  Event.preventDefault(event)
  const { dataTransfer, clientX, clientY } = event
  const { files } = dataTransfer
  const uid = ComponentUid.fromEvent(event)
  if (files.length > 0) {
    return DragFunctions.handleDropFiles(uid, clientX, clientY, files)
  }
  const filePath = DataTransfer.getFilePath(dataTransfer)
  if (filePath) {
    DragFunctions.handleDropFilePath(uid, clientX, clientY, filePath)
  }
}
