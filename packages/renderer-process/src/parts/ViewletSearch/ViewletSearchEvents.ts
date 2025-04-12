import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as PointerEvents from '../PointerEvents/PointerEvents.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'
import * as ViewletSearchFunctions from './ViewletSearchFunctions.ts'

export const handleFocus = () => {
  // TODO send focus event to search view first
  return ['Focus.setFocus', WhenExpression.FocusSearchInput]
}

export const handleScrollBarThumbPointerMove = (event) => {
  const { clientY } = event
  const uid = ComponentUid.fromEvent(event)
  ViewletSearchFunctions.handleScrollBarMove(uid, clientY)
}

export const handleScrollBarPointerUp = (event) => {
  const { target, pointerId } = event
  PointerEvents.stopTracking(target, pointerId, handleScrollBarThumbPointerMove, handleScrollBarPointerUp)
}

export const handleScrollBarPointerDown = (event) => {
  const { target, pointerId, clientY } = event
  PointerEvents.startTracking(target, pointerId, handleScrollBarThumbPointerMove, handleScrollBarPointerUp)
  return ['handleScrollBarClick', clientY]
}

export const handleHeaderFocusIn = (event) => {
  const { target } = event
  const key = target.name || target.title
  if (!key) {
    return []
  }
  return ['handleFocusIn', key]
}

export const returnValue = true
