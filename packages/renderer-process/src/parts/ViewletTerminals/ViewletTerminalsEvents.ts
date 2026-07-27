import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as GetNodeIndex from '../GetNodeIndex/GetNodeIndex.ts'
import * as ViewletTerminalsFunctions from './ViewletTerminalsFunctions.ts'

export const handleClickTab = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { target } = event
  const tab = target.closest?.('.TerminalTab')
  if (!tab) {
    return
  }
  const index = GetNodeIndex.getNodeIndex(tab)
  const shouldDelete = Boolean(target.closest?.('.TerminalTabDeleteButton'))
  ViewletTerminalsFunctions.handleClickTab(uid, index, shouldDelete)
}
