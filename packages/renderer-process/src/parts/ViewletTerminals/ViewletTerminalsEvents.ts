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

export const handleMouseDown = (event) => {
  const uid = ComponentUid.fromEvent(event)
  const { target } = event
  const terminal = target.closest?.('.XtermTerminal')
  if (!terminal) {
    return
  }
  const terminalUid = ComponentUid.get(terminal)
  if (!terminalUid) {
    return
  }
  ViewletTerminalsFunctions.handleMouseDown(uid, terminalUid)
}
