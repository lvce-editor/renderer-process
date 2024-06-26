import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as FindIndex from '../FindIndex/FindIndex.ts'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as ViewletTitleBarMenuBarFunctions from './ViewletTitleBarMenuBarFunctions.ts'

const isInsideTitleBarMenu = ($Element) => {
  return (
    $Element.classList.contains('MenuItem') ||
    $Element.classList.contains('Menu') ||
    $Element.classList.contains('TitleBarTopLevelEntry') ||
    $Element.classList.contains('TitleBarMenuBar')
  )
}

export const handleFocusOut = (event) => {
  const { target, relatedTarget } = event
  if (relatedTarget && isInsideTitleBarMenu(relatedTarget)) {
    return
  }
  if (target && isInsideTitleBarMenu(target)) {
    return
  }
  const uid = ComponentUid.fromEvent(event)
  ViewletTitleBarMenuBarFunctions.closeMenu(uid)
}

export const handlePointerOver = (event) => {
  const { target } = event
  const index = getIndex(target)
  const uid = ComponentUid.fromEvent(event)
  ViewletTitleBarMenuBarFunctions.handleMouseOver(uid, index)
}

export const handlePointerOut = (event) => {
  const { target } = event
  const index = getIndex(target)
  const uid = ComponentUid.fromEvent(event)
  ViewletTitleBarMenuBarFunctions.handleMouseOut(uid, index)
}

const getIndex = ($Target) => {
  if ($Target.classList.contains('TitleBarTopLevelEntry')) {
    return GetNodeIndex.getNodeIndex($Target)
  }
  return -1
}

export const handleClick = (event) => {
  const { button, target } = event
  const index = getIndex(target)
  const uid = ComponentUid.fromEvent(event)
  ViewletTitleBarMenuBarFunctions.handleClick(uid, button, index)
}

const getLevelAndIndex = (event) => {
  const { target } = event
  const $Menu = target.closest('.Menu')
  const index = FindIndex.findIndex($Menu, target)
  const { id } = $Menu
  const level = Number.parseInt(id.slice(5))
  return {
    level,
    index,
  }
}

export const handleMenuMouseOver = (event) => {
  // TODO just send pixel coordinates instead
  const { level, index } = getLevelAndIndex(event)
  const uid = ComponentUid.fromEvent(event)
  ViewletTitleBarMenuBarFunctions.handleMenuMouseOver(uid, level, index)
}

export const handleMenuClick = (event) => {
  const { level, index } = getLevelAndIndex(event)
  const uid = ComponentUid.fromEvent(event)
  ViewletTitleBarMenuBarFunctions.handleMenuClick(uid, level, index)
}

export const handleFocusIn = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletTitleBarMenuBarFunctions.handleFocus(uid)
}
