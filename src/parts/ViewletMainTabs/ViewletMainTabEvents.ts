import * as AllowedDragEffectType from '../AllowedDragEffectType/AllowedDragEffectType.ts'
import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as DataTransfer from '../DataTransfer/DataTransfer.ts'
import * as Event from '../Event/Event.ts'
import * as ViewletMainTabsFunctions from './ViewletMainTabsFunctions.ts'

// TODO
const getUid = () => {
  const $Main = document.getElementById('Main')
  if (!$Main) {
    return 0
  }
  return ComponentUid.get($Main)
}

export const handleTabsWheel = (event) => {
  const uid = getUid()
  const { deltaX, deltaY } = event
  ViewletMainTabsFunctions.handleTabsWheel(uid, deltaX, deltaY)
}

export const handleDragStart = (event) => {
  const { target, dataTransfer } = event
  DataTransfer.setEffectAllowed(dataTransfer, AllowedDragEffectType.CopyMove)
  dataTransfer.setData('x-lvce-drag', target.dataset.dragUid)
}

export const handleDragOver = (event) => {
  const { clientX, clientY } = event
  const uid = getUid()
  ViewletMainTabsFunctions.handleTabsDragOver(uid, clientX, clientY)
}

/**
 *
 * @param {DragEvent} event
 */
export const handleDrop = (event) => {
  Event.preventDefault(event)
  const { dataTransfer, clientX, clientY } = event
  const item = dataTransfer.getData('x-lvce-drag')
  const uid = getUid()
  ViewletMainTabsFunctions.handleTabDrop(uid, item, clientX, clientY)
}

export const handleTabsMouseDown = (event) => {
  const { clientX, clientY, button } = event
  const uid = getUid()
  ViewletMainTabsFunctions.handleTabClick(uid, button, clientX, clientY)
}

export const handleTabsContextMenu = (event) => {
  const { clientX, clientY } = event
  Event.preventDefault(event)
  const uid = getUid()
  ViewletMainTabsFunctions.handleTabContextMenu(uid, clientX, clientY)
}
