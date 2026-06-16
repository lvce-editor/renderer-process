import * as AriaRoleDescriptionType from '../AriaRoleDescriptionType/AriaRoleDescriptionType.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Assert from '../Assert/Assert.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as ViewletSidebarEvents from './ViewletSideBarEvents.ts'

export const create = () => {
  const $SidebarTitleAreaTitle = document.createElement('h2')
  $SidebarTitleAreaTitle.className = 'SideBarTitleAreaTitle'

  const $SidebarTitleArea = document.createElement('div')
  $SidebarTitleArea.className = 'SideBarTitleArea'
  $SidebarTitleArea.append($SidebarTitleAreaTitle)

  const $Viewlet = document.createElement('div')
  $Viewlet.id = 'SideBar'
  $Viewlet.className = 'Viewlet SideBar'
  $Viewlet.role = AriaRoles.Complementary
  $Viewlet.ariaRoleDescription = AriaRoleDescriptionType.Sidebar
  $Viewlet.append($SidebarTitleArea)

  return {
    $Actions: undefined,
    $Sidebar: $Viewlet,
    $SidebarContent: undefined,
    $SidebarTitleArea,
    $SidebarTitleAreaTitle,
    $Viewlet,
  }
}

export const attachEvents = (state) => {
  const { $SidebarTitleArea } = state
  AttachEvents.attachEvents($SidebarTitleArea, {
    [DomEventType.Click]: ViewletSidebarEvents.handleHeaderClick,
  })
}

export const dispose = (state) => {
  Assert.object(state)
  state.$Sidebar.replaceChildren()
}

export const setTitle = (state, name) => {
  const { $SidebarTitleAreaTitle } = state
  $SidebarTitleAreaTitle.title = name
  $SidebarTitleAreaTitle.textContent = name
}

export const setActionsDom = (state, actions, parentId, eventMap = {}) => {
  if (actions.length === 0) {
    return
  }

  const { $Actions, $SidebarTitleArea } = state
  const $Parent = document.createElement('div')
  const $NewViewlet = VirtualDom.rememberFocus($Parent, actions, {}, parentId)
  if ($Actions) {
    $Actions.replaceWith($NewViewlet)
  } else {
    $SidebarTitleArea.append($NewViewlet)
  }
  state.$Actions = $NewViewlet
}

export const focus = async () => {
  // await
}
