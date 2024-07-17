import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Assert from '../Assert/Assert.ts'
import * as RememberFocus from '../RememberFocus/RememberFocus.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'
import * as ViewletExplorerEvents from './ViewletExplorerEvents.ts'

export const create = () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.className = 'Viewlet Explorer'
  $Viewlet.tabIndex = 0
  $Viewlet.role = AriaRoles.Tree
  $Viewlet.ariaLabel = 'Files Explorer'
  return {
    $Viewlet,
  }
}

export const Events = ViewletExplorerEvents

export const handleError = (state, message) => {
  Assert.object(state)
  Assert.string(message)
  const { $Viewlet } = state
  $Viewlet.textContent = message
}

export const focusInput = (state, id) => {
  const $Input = document.getElementById(id)
  if (!$Input) {
    return
  }
  $Input.focus()
  RendererWorker.send('Focus.setFocus', WhenExpression.FocusExplorerEditBox)
}

export const dispose = (state) => {}

export const setDropTargets = (state, oldDropTargets, newDropTargets) => {
  // TODO use virtual dom for this
  const { $Viewlet } = state
  for (const oldIndex of oldDropTargets) {
    if (oldIndex === -1) {
      $Viewlet.classList.remove('DropTarget')
    } else {
      $Viewlet.children[oldIndex].classList.remove('DropTarget')
    }
  }
  for (const newIndex of newDropTargets) {
    if (newIndex === -1) {
      $Viewlet.classList.add('DropTarget')
    } else {
      $Viewlet.children[newIndex].classList.add('DropTarget')
    }
  }
}

export const setDom = (state, dom) => {
  const { $Viewlet } = state
  RememberFocus.rememberFocus($Viewlet, dom, ViewletExplorerEvents, 0)
}
