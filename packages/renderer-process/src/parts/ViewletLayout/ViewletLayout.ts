import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as ViewletLayoutEvents from './ViewletLayoutEvents.ts'

export const create = () => {
  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $SashSidebar = document.createElement('div')
  $SashSidebar.className = 'Viewlet Sash SashVertical'
  $SashSidebar.id = 'SashSideBar'

  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $SashPanel = document.createElement('div')
  $SashPanel.className = 'Viewlet Sash SashHorizontal'
  $SashPanel.id = 'SashPanel'

  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Workbench'
  $Viewlet.className = 'Viewlet Layout Workbench'
  $Viewlet.role = AriaRoles.Application
  $Viewlet.append($SashSidebar, $SashPanel)

  return {
    $SashPanel,
    $SashSidebar,
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $SashPanel, $SashSidebar } = state
  AttachEvents.attachEvents($SashSidebar, {
    [DomEventType.DoubleClick]: ViewletLayoutEvents.handleSashDoubleClick,
    [DomEventType.PointerDown]: ViewletLayoutEvents.handleSashPointerDown,
  })

  AttachEvents.attachEvents($SashPanel, {
    [DomEventType.DoubleClick]: ViewletLayoutEvents.handleSashDoubleClick,
    [DomEventType.PointerDown]: ViewletLayoutEvents.handleSashPointerDown,
  })

  AttachEvents.attachEvents(window, {
    [DomEventType.Blur]: ViewletLayoutEvents.handleBlur,
    [DomEventType.Focus]: ViewletLayoutEvents.handleFocus,
    [DomEventType.KeyDown]: ViewletLayoutEvents.handleKeyDown,
    [DomEventType.KeyUp]: ViewletLayoutEvents.handleKeyUp,
    [DomEventType.Resize]: ViewletLayoutEvents.handleResize,
  })
}

export const setSashes = (state, sashSidebar, sashPanel) => {
  const { $SashPanel, $SashSidebar } = state
  SetBounds.setBounds($SashSidebar, sashSidebar.x, sashSidebar.y, sashSidebar.width, sashSidebar.height)
  $SashSidebar.classList.toggle('SashActive', sashSidebar.active)
  SetBounds.setBounds($SashPanel, sashPanel.x, sashPanel.y, sashPanel.width, sashPanel.height)
  $SashPanel.classList.toggle('SashActive', sashPanel.active)
}
