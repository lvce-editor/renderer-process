import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as ViewletSidebarFunctions from './ViewletSideBarFunctions.ts'

const handleClickAction = (target, uid) => {
  const index = GetNodeIndex.getNodeIndex(target)
  if (target && target.dataset && target.dataset.command) {
    ViewletSidebarFunctions.handleClickAction(uid, index, target.dataset.command)
  }
}

export const handleHeaderClick = (event) => {
  const { target } = event
  const uid = ComponentUid.fromEvent(event)
  const action = target.closest?.('.IconButton[data-command]')
  if (action) {
    handleClickAction(action, uid)
  }
}
