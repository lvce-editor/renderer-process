import * as PointerEvents from '../PointerEvents/PointerEvents.ts'
import * as ViewletSashFunctions from './ViewletSashFunctions.ts'

const getSashId = ($Target) => {
  if ($Target.id === 'SashPanel') {
    return 'Panel'
  }
  if ($Target.id === 'SashSideBar') {
    return 'SideBar'
  }
  return ''
}

export const handleSashPointerMove = (event) => {
  const { clientX, clientY } = event
  ViewletSashFunctions.handleSashPointerMove(clientX, clientY)
}

export const handleSashPointerUp = (event) => {
  const { pointerId, target } = event
  PointerEvents.stopTracking(target, pointerId, handleSashPointerMove, handleSashPointerUp)
}

export const handleSashPointerDown = (event) => {
  const { pointerId, target } = event
  PointerEvents.startTracking(target, pointerId, handleSashPointerMove, handleSashPointerUp)
  const id = getSashId(target)
  ViewletSashFunctions.handleSashPointerDown(id)
}
