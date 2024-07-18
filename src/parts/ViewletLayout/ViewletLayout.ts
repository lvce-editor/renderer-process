import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as ViewletState from '../ViewletState/ViewletState.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as ViewletLayoutEvents from './ViewletLayoutEvents.ts'

export const create = () => {
  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $SashSideBar = document.createElement('div')
  $SashSideBar.className = 'Viewlet Sash SashVertical'
  $SashSideBar.id = 'SashSideBar'

  // TODO use aria role splitter once supported https://github.com/w3c/aria/issues/1348
  const $SashPanel = document.createElement('div')
  $SashPanel.className = 'Viewlet Sash SashHorizontal'
  $SashPanel.id = 'SashPanel'

  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'Workbench'
  $Viewlet.className = 'Viewlet Layout Workbench'
  $Viewlet.role = AriaRoles.Application
  // $Viewlet.append($SashSideBar, $SashPanel)

  const $SplitViewVertical = document.createElement('div')
  $SplitViewVertical.className = 'SplitView SplitViewVertical'

  const $SecondarySplitViewVertical = document.createElement('div')
  $SecondarySplitViewVertical.className = 'SplitView SplitViewVertical'

  $SplitViewVertical.append($SashPanel)

  const $SplitViewHorizontal = document.createElement('div')
  $SplitViewHorizontal.className = 'SplitView SplitViewHorizontal'

  const $TitleBar = document.createElement('div')
  $TitleBar.className = 'Viewlet TitleBar'

  const $StatusBar = document.createElement('div')
  $StatusBar.className = 'Viewlet StatusBar'

  $Viewlet.append($SplitViewVertical)

  const $Content = document.createElement('div')
  $Content.className = 'Viewlet Content'

  const mounted = Object.create(null)

  mounted.Content = $Content

  return {
    $Viewlet,
    $SashSideBar,
    $SashPanel,
    $SplitViewVertical,
    $SplitViewHorizontal,
    $SecondarySplitViewVertical,
    mounted,
  }
}

export const appendLayoutItem = (state, childUid, sideBarLocation, moduleId) => {
  const { $SplitViewVertical, $SplitViewHorizontal, mounted, $SecondarySplitViewVertical } = state
  const instance = ViewletState.state.instances[childUid]
  const $Element = instance.state.$Viewlet
  mounted[moduleId] = $Element
  if (moduleId === 'TitleBar' || moduleId === 'StatusBar') {
    const children = [mounted['TitleBar'], $SplitViewHorizontal, mounted['StatusBar']].filter(Boolean)
    $SplitViewVertical.append(...children)
  } else if (moduleId === 'SideBar' || moduleId === 'Main' || moduleId === 'Panel' || moduleId === 'ActivityBar') {
    const secondChildren = [mounted['Main'], mounted['Panel']].filter(Boolean)
    $SecondarySplitViewVertical.append(...secondChildren)
    const children = [$SecondarySplitViewVertical, mounted['ActivityBar']].filter(Boolean)
    $SplitViewHorizontal.append(...children)
  }

  console.log({ childUid, sideBarLocation, moduleId, instance })
}

export const attachEvents = (state) => {
  const { $SashSideBar, $SashPanel } = state
  AttachEvents.attachEvents($SashSideBar, {
    [DomEventType.PointerDown]: ViewletLayoutEvents.handleSashPointerDown,
    [DomEventType.DoubleClick]: ViewletLayoutEvents.handleSashDoubleClick,
  })

  AttachEvents.attachEvents($SashPanel, {
    [DomEventType.PointerDown]: ViewletLayoutEvents.handleSashPointerDown,
    [DomEventType.DoubleClick]: ViewletLayoutEvents.handleSashDoubleClick,
  })

  AttachEvents.attachEvents(window, {
    [DomEventType.Resize]: ViewletLayoutEvents.handleResize,
    [DomEventType.Focus]: ViewletLayoutEvents.handleFocus,
    [DomEventType.Blur]: ViewletLayoutEvents.handleBlur,
    [DomEventType.KeyDown]: ViewletLayoutEvents.handleKeyDown,
    [DomEventType.KeyUp]: ViewletLayoutEvents.handleKeyUp,
  })
}

export const setSashes = (state, sashSideBar, sashPanel) => {
  const { $SashSideBar, $SashPanel } = state
  SetBounds.setBounds($SashSideBar, sashSideBar.x, sashSideBar.y, sashSideBar.width, sashSideBar.height)
  $SashSideBar.classList.toggle('SashActive', sashSideBar.active)
  SetBounds.setBounds($SashPanel, sashPanel.x, sashPanel.y, sashPanel.width, sashPanel.height)
  $SashPanel.classList.toggle('SashActive', sashPanel.active)
}
