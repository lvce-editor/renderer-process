import * as AriaBoolean from '../AriaBoolean/AriaBoolean.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as DomAttributeType from '../DomAttributeType/DomAttributeType.ts'
import * as Menu from '../OldMenu/Menu.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as Widget from '../Widget/Widget.ts'
import * as ViewletTitleBarMenuBarEvents from './ViewletTitleBarMenuBarEvents.ts'

const activeId = 'TitleBarEntryActive'

export const dispose = (state) => {}

export const focus = (state) => {
  const { $TitleBarMenuBar } = state
  $TitleBarMenuBar.firstChild.focus()
}

// TODO set proper tabIndex 0 to focused item https://www.w3.org/TR/wai-aria-practices/examples/menubar/menubar-1/menubar-1.html

// TODO screenreader doesn't read top level label
// when menu is open,
// first item is selected,
// right is clicked it just reads
// "Expanded" instead of "Selection Expanded"

// TODO sometimes screenreader reads too much (e.g. "File, expanded, opens menu, expanded")

// TODO don't focus on separators

// TODO don't focus on hover
// only focus on hover when it has already focus or the menu has focus

// TODO title bar menu bar is very inefficient:

// before: 5 times recalculate style
// 1.37ms Recalculate style
// 83us Update Layer tree
// 0.34ms paint
// 0.79ms composite layer
// 0.23ms Hit test
// 1.42ms Recalculate style
// 1.44ms Recalculate style
// 2.08ms Recalculate style
// 0.44ms Recalculate style
// 0.52ms Layout
// 0.16ms Update Layer Tree
// 48us hit test
// 16us Update Layer Tree
// 0.36ms paint
// 0.33ms composite layer

// now: 2 recalculate styles
// 0.43ms recalculate style
// 0.53ms recalculate style
// 0.19ms layout
// 0.16ms update layer tree
// 30us hit test
// 17us update layer tree
// 0.17ms paint
// 0.19ms composite layers

export const setFocusedIndex = (state, unFocusIndex, focusIndex, oldIsMenuOpen, newIsMenuOpen) => {
  Assert.object(state)
  Assert.number(unFocusIndex)
  Assert.number(focusIndex)
  const { $Viewlet } = state
  if (focusIndex !== -1) {
    $Viewlet.focus()
    $Viewlet.setAttribute(DomAttributeType.AriaActiveDescendant, activeId)
  }
}

// TODO the focus variable is confusing: false means keep focus in menubar, true means focus the menu
export const openMenu = (state, unFocusIndex, index, level, menuItems, menuFocusedIndex, focus, x, y, width, height) => {
  Assert.object(state)
  Assert.number(unFocusIndex)
  Assert.number(index)
  Assert.number(level)
  Assert.array(menuItems)
  Assert.number(menuFocusedIndex)
  Assert.boolean(focus)
  Assert.number(x)
  Assert.number(y)
  Assert.number(width)
  Assert.number(height)
  const { $Viewlet } = state
  // TODO this code is very unclean
  $Viewlet.addEventListener('mouseenter', ViewletTitleBarMenuBarEvents.handlePointerOver, {
    capture: true,
  })
  if (unFocusIndex !== -1) {
    $Viewlet.children[unFocusIndex].ariaExpanded = AriaBoolean.False
    $Viewlet.children[unFocusIndex].removeAttribute(DomAttributeType.AriaOwns)
  }
  $Viewlet.children[index].ariaExpanded = AriaBoolean.True
  const $$Menus = Menu.state.$$Menus
  Menu.state.$$Menus = []
  // @ts-expect-error
  Menu.showControlled({
    x,
    y,
    width,
    height,
    items: menuItems,
    handleFocusOut: ViewletTitleBarMenuBarEvents.handleFocusOut,
    $Parent: $Viewlet.children[index],
    level,
  })
  if (menuFocusedIndex !== -1) {
    Menu.focusIndex(0, -1, menuFocusedIndex)
  }
  for (const $Menu of $$Menus) {
    Widget.remove($Menu)
  }
}

// TODO there need to be two variants of closeMenu: one just closes menu, another close menu and focuses top level entry
export const closeMenu = (state, unFocusIndex, index) => {
  const { $Viewlet } = state
  if (unFocusIndex !== -1) {
    $Viewlet.children[unFocusIndex].ariaExpanded = AriaBoolean.False
    $Viewlet.children[unFocusIndex].removeAttribute(DomAttributeType.AriaOwns)
  }
  if (index !== -1) {
    $Viewlet.children[index].focus()
  }
  Menu.hide(/* restoreFocus */ false)
  $Viewlet.removeEventListener('mouseenter', ViewletTitleBarMenuBarEvents.handlePointerOver, {
    capture: true,
  })
}

const create$Menu = () => {
  const $Menu = document.createElement('div')
  $Menu.className = 'Menu'
  $Menu.role = AriaRoles.Menu
  $Menu.tabIndex = -1
  // $ContextMenu.onmousedown = contextMenuHandleMouseDown
  // TODO mousedown vs click? (click is usually better but mousedown is faster, why wait 100ms?)
  // $Menu.addEventListener('mousedown', handleMouseDown)
  // $Menu.addEventListener('mouseenter', handleMouseEnter, {
  //   capture: true,
  // })
  // $Menu.addEventListener('mouseleave', handleMouseLeave, {
  //   capture: true,
  // })
  // $Menu.addEventListener('mousemove', handleMouseMove, {
  //   passive: true,
  // })
  // $Menu.onkeydown = handleKeyDown
  // $Menu.addEventListener('focusout', handleFocusOut)
  // $Menu.oncontextmenu = handleContextMenu
  // $ContextMenu.onfocus = handleFocus
  // $ContextMenu.onblur = handleBlur
  return $Menu
}

// TODO recycle menus
export const setMenus = (state, changes, uid) => {
  Assert.array(changes)
  Assert.number(uid)
  state.$$Menus ||= []
  const { $$Menus } = state
  for (const change of changes) {
    const type = change[0]
    switch (type) {
      case 'addMenu': {
        const menu = change[1]
        const dom = change[2]
        const $Menu = create$Menu()
        ComponentUid.set($Menu, uid)
        $Menu.onmouseover = ViewletTitleBarMenuBarEvents.handleMenuMouseOver
        $Menu.onclick = ViewletTitleBarMenuBarEvents.handleMenuClick
        const { x, y, width, height, level, focusedIndex } = menu
        SetBounds.setBounds($Menu, x, y, width, height)
        VirtualDom.renderInto($Menu, dom)
        $Menu.id = `Menu-${level}`
        Widget.append($Menu)
        if (focusedIndex !== -1) {
          const $Child = $Menu.children[focusedIndex]
          // @ts-expect-error
          $Child.focus()
        }
        $$Menus.push($Menu)
        break
      }
      case 'updateMenu': {
        const menu = change[1]
        const newLength = change[2]
        const dom = change[3]
        const { level, x, y, width, height, focusedIndex } = menu
        const $Menu = $$Menus[level]
        SetBounds.setBounds($Menu, x, y, width, height)
        VirtualDom.renderInto($Menu, dom)
        if (level === newLength - 1) {
          if (focusedIndex === -1) {
            $Menu.focus()
          } else {
            const $Child = $Menu.children[focusedIndex]
            $Child.focus()
          }
        }

        break
      }
      case 'closeMenus': {
        const keepCount = change[1]
        const $$ToDispose = $$Menus.slice(keepCount)
        for (const $ToDispose of $$ToDispose) {
          Widget.remove($ToDispose)
        }
        $$Menus.length = keepCount

        break
      }
      // No default
    }
  }
}



export * as Events from './ViewletTitleBarMenuBarEvents.ts'