import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as ViewletPanelFunctions from './ViewletPanelFunctions.ts'

export const handleClickClose = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletPanelFunctions.hidePanel(uid)
}

export const handleClickMaximize = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletPanelFunctions.toggleMaximize(uid)
}

const handleClickTab = (target, uid) => {
  const index = GetNodeIndex.getNodeIndex(target)
  ViewletPanelFunctions.selectIndex(uid, index)
}

const handleClickAction = (target, uid) => {
  const index = GetNodeIndex.getNodeIndex(target)
  const { command } = target.dataset
  if (!command) {
    // eslint-disable-next-line no-console
    console.info('[panel] action command not found')
    return
  }
  ViewletPanelFunctions.handleClickAction(uid, index, command)
}

export const handleHeaderClick = (event) => {
  const { target } = event
  const uid = ComponentUid.fromEvent(event)
  if (target.classList.contains('PanelTab')) {
    handleClickTab(target, uid)
    return
  }
  if (target.classList.contains('IconButton')) {
    handleClickAction(target, uid)
  }
}

export const handleFilterInput = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { target } = event
  const { value } = target
  ViewletPanelFunctions.handleFilterInput(uid, value)
}
