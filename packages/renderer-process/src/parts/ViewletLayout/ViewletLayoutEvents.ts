import * as GetSashId from '../GetSashId/GetSashId.ts'
import * as KeyBindingsEvents from '../KeyBindingsEvents/KeyBindingsEvents.ts'
import * as PointerEvents from '../PointerEvents/PointerEvents.ts'
import * as ViewletLayoutFunctions from './ViewletLayoutFunctions.ts'

export const handleSashPointerMove = (event) => {
  const { clientX, clientY } = event
  ViewletLayoutFunctions.handleSashPointerMove(clientX, clientY)
}

export const handlePointerCaptureLost = (event) => {
  const { pointerId, target } = event
  PointerEvents.stopTracking(target, pointerId, handleSashPointerMove, handlePointerCaptureLost)
  const id = GetSashId.getSashId(target)
  ViewletLayoutFunctions.handleSashPointerUp(id)
}

export const handleSashPointerDown = (event) => {
  const { pointerId, target } = event
  PointerEvents.startTracking(target, pointerId, handleSashPointerMove, handlePointerCaptureLost)
  const id = GetSashId.getSashId(target)
  ViewletLayoutFunctions.handleSashPointerDown(id)
}

export const handleSashDoubleClick = (event) => {
  const { target } = event
  const id = GetSashId.getSashId(target)
  ViewletLayoutFunctions.handleSashDoubleClick(id)
}

export const handleResize = () => {
  const { innerHeight, innerWidth } = window
  ViewletLayoutFunctions.handleResize(innerWidth, innerHeight)
}

export const handleFocus = () => {
  ViewletLayoutFunctions.handleFocus()
}

export const handleBlur = () => {
  ViewletLayoutFunctions.handleBlur()
}

export const handleKeyDown = KeyBindingsEvents.handleKeyDown

export const handleKeyUp = KeyBindingsEvents.handleKeyUp
