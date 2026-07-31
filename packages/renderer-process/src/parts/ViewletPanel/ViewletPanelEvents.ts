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

const handleClickAction = (target) => {
  const index = GetNodeIndex.getNodeIndex(target)
  const { command } = target.dataset
  if (!command) {
    // eslint-disable-next-line no-console
    console.info('[panel] action command not found')
    return
  }
  const childUid = ComponentUid.get(target)
  ViewletPanelFunctions.handleClickAction(childUid, index, command)
}

export const handleHeaderClick = (event) => {
  const { target } = event
  const uid = ComponentUid.fromEvent(event)
  if (target.classList.contains('PanelTab')) {
    handleClickTab(target, uid)
    return
  }
  const action = target.closest?.('.IconButton[data-command]')
  if (action) {
    handleClickAction(action)
  }
}

export const handleFilterInput = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { target } = event
  const { value } = target
  ViewletPanelFunctions.handleFilterInput(uid, value)
}
