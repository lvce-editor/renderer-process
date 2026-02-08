import { getViewletInstance, setViewletInstance } from '@lvce-editor/virtual-dom'
import * as ApplyPatch from '../ApplyPatch/ApplyPatch.ts'
import * as Assert from '../Assert/Assert.ts'
import * as AttachEvents from '../AttachEvents/AttachEvents.ts'
import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import { addCssStyleSheet } from '../Css/Css.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as DragInfo from '../DragInfo/DragInfo.ts'
import * as KeyBindings from '../KeyBindings/KeyBindings.ts'
import * as Logger from '../Logger/Logger.ts'
import * as Promises from '../Promises/Promises.ts'
import * as RememberFocus from '../RememberFocus/RememberFocus.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import { VError } from '../VError/VError.ts'
import * as ViewletModule from '../ViewletModule/ViewletModule.ts'
import { state } from '../ViewletState/ViewletState.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as ViewletLayoutEvents from '../ViewletLayout/ViewletLayoutEvents.ts'

export const mount = ($Parent, state) => {
  $Parent.replaceChildren(state.$Viewlet)
}

export const create = (id, uid = id) => {
  const module = state.modules[id]
  if (!module) {
    throw new Error(`module not found: ${id}`)
  }
  const existing = getViewletInstance(id)
  if (existing?.state.$Viewlet.isConnected) {
    existing.state.$Viewlet.remove()
  }
  const instanceState = module.create()
  ComponentUid.set(instanceState.$Viewlet, uid)
  if (module.attachEvents) {
    module.attachEvents(instanceState)
  }
  setViewletInstance(uid, {
    factory: module,
    state: instanceState,
  })
}

export const createFunctionalRoot = (id, uid = id, hasFunctionalEvents) => {
  let module = state.modules[id]
  if (hasFunctionalEvents) {
    module ||= {}
  }
  if (!module) {
    throw new Error(`module not found: ${id}`)
  }
  const existing = getViewletInstance(id)
  if (existing?.state.$Viewlet.isConnected) {
    existing.state.$Viewlet.remove()
  }
  const instanceState = { $Viewlet: document.createElement('div') }
  setViewletInstance(uid, {
    factory: module,
    state: instanceState,
  })
}

export const addKeyBindings = (id, keyBindings) => {
  // @ts-expect-error
  KeyBindings.addKeyBindings(id, keyBindings)
}

export const removeKeyBindings = (id) => {
  // @ts-expect-error
  KeyBindings.removeKeyBindings(id)
}

export const loadModule = async (id) => {
  try {
    const module = await ViewletModule.load(id)
    state.modules[id] = module
  } catch (error) {
    throw new VError(error, `Failed to load ${id}`)
  }
}

export const invoke = (viewletId, method, ...args) => {
  Assert.string(method)
  const instance = getViewletInstance(viewletId)
  if (!instance?.factory) {
    if (viewletId && method !== 'setActionsDom') {
      Logger.warn(`cannot execute ${method} viewlet instance ${viewletId} not found`)
    }
    return
  }
  if (typeof instance.factory[method] !== 'function') {
    Logger.warn(`method ${method} in ${viewletId} not implemented`)
    return
  }
  return instance.factory[method](instance.state, ...args)
}

export const focus = (viewletId) => {
  if (location.search.includes('traceFocus')) {
    // eslint-disable-next-line no-console
    console.trace(`focus ${viewletId}`)
  }
  const instance = getViewletInstance(viewletId)
  if (instance.factory?.setFocused) {
    instance.factory.setFocused(instance.state, true)
  } else if (instance?.factory?.focus) {
    instance.factory.focus(instance.state)
  } else {
    // TODO push focusContext
  }
}

export const focusElementByName = (viewletId, name) => {
  if (!name) {
    return
  }
  const selector = `[name="${name}"]`
  if (location.search.includes('traceFocus')) {
    // eslint-disable-next-line no-console
    console.trace(`focusByName ${viewletId} ${name}`)
  }
  const instance = getViewletInstance(viewletId)
  if (!instance) {
    return
  }
  const { $Viewlet } = instance.state
  const $Element = $Viewlet.querySelector(selector)
  if (!$Element) {
    return
  }
  $Element.focus()
}

export const setElementProperty = (viewletId, name, key, value) => {
  const selector = `[name="${name}"]`
  const instance = getViewletInstance(viewletId)
  if (!instance) {
    return
  }
  const { $Viewlet } = instance.state
  const $Element = $Viewlet.querySelector(selector)
  if (!$Element) {
    return
  }
  $Element[key] = value
}

export const setValueByName = (viewletId, name, value) => {
  setElementProperty(viewletId, name, 'value', value)
}

export const setInputValues = (viewletId, items) => {
  for (const { name, value } of items) {
    setElementProperty(viewletId, name, 'value', value)
  }
}

export const setCheckBoxValue = (viewletId, name, value) => {
  setElementProperty(viewletId, name, 'checked', value)
}

export const setSelectionByName = (viewletId: number, name: string, start: number, end: number): void => {
  const selector = `[name="${name}"]`
  const instance = getViewletInstance(viewletId)
  if (!instance) {
    return
  }
  const { $Viewlet } = instance.state
  const $Element = $Viewlet.querySelector(selector) as HTMLInputElement
  if (!$Element) {
    return
  }
  $Element.selectionStart = start
  $Element.selectionEnd = end
}

export const setUid = (viewletId, uid) => {
  const instance = getViewletInstance(viewletId)
  if (!instance) {
    return
  }
  const { $Viewlet } = instance.state
  ComponentUid.set($Viewlet, uid)
}

export const focusSelector = (viewletId, selector) => {
  const instance = getViewletInstance(viewletId)
  if (!instance) {
    return
  }
  const { $Viewlet } = instance.state
  const $Element = $Viewlet.querySelector(selector)
  if (!$Element) {
    return
  }
  $Element.focus()
}

/**
 * @deprecated
 */
export const refresh = (viewletId, viewletContext) => {
  const instance = getViewletInstance(viewletId)
  if (instance) {
    instance.factory.refresh(instance.state, viewletContext)
  } else {
    // @ts-expect-error
    state.refreshContext[viewletId] = viewletContext
  }
}

// TODO handle error when viewlet creation fails

// TODO remove send -> use invoke instead
export const send = (viewletId, method, ...args) => {
  const instance = getViewletInstance(viewletId)
  if (instance) {
    instance.factory[method](...args)
  } else {
    // TODO
    Logger.warn('instance not present')
  }
}

const specialIds = new Set(['TitleBar', 'SideBar', 'Main', 'ActivityBar', 'StatusBar', 'Panel'])

const isSpecial = (id) => {
  return specialIds.has(id)
}

const createPlaceholder = (viewletId, parentId, top, left, width, height) => {
  const $PlaceHolder = document.createElement('div')
  $PlaceHolder.className = `Viewlet ${viewletId}`
  SetBounds.setBounds($PlaceHolder, left, top, width, height)
  if (isSpecial(viewletId)) {
    $PlaceHolder.id = viewletId
  }
  const parentInstance = getViewletInstance(parentId)
  const $Parent = parentInstance.state.$Viewlet
  $Parent.append($PlaceHolder)
  setViewletInstance(viewletId, {
    state: {
      $Viewlet: $PlaceHolder,
    },
  })
}

const setDragData = (viewletId: number, dragData: any): void => {
  DragInfo.set(viewletId, dragData)
}

const setDom = (viewletId, dom) => {
  const instance = getViewletInstance(viewletId)
  if (!instance) {
    return
  }
  const { Events } = instance.factory
  const { $Viewlet } = instance.state
  VirtualDom.renderInto($Viewlet, dom, Events)
}

const setDom2 = (viewletId, dom) => {
  const instance = getViewletInstance(viewletId)
  if (!instance) {
    return
  }
  const { Events } = instance.factory
  const { $Viewlet } = instance.state
  let uid
  if ($Viewlet) {
    try {
      uid = ComponentUid.get($Viewlet)
    } catch {}
  }
  // TODO optimize rendering with virtual dom diffing
  const $NewViewlet = RememberFocus.rememberFocus($Viewlet, dom, Events, viewletId)
  if (uid) {
    // @ts-ignore
    ComponentUid.set($NewViewlet, uid)
  }
  setViewletInstance(viewletId, { ...instance, state: { ...instance.state, $Viewlet: $NewViewlet } })
}

export const setPatches = (uid, patches) => {
  const instance = getViewletInstance(uid)
  if (!instance) {
    return
  }
  const { $Viewlet } = instance.state
  if (!$Viewlet) {
    throw new Error('element not found')
  }
  if (patches.length === 1 && patches[0].type === 6) {
    setDom2(uid, patches[0].nodes)
    return
  }
  ApplyPatch.applyPatch($Viewlet, patches, {}, uid)
}

const waitForElement = (selector: string): Promise<Element> => {
  const element = document.querySelector(selector)
  if (element) {
    return Promise.resolve(element)
  }

  const { promise, resolve } = Promises.withResolvers<Element>()
  const observer = new MutationObserver(() => {
    const element = document.querySelector(selector)
    if (element) {
      observer.disconnect()
      resolve(element)
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })
  return promise
}

export const move = async (uid: number, selector: string, target: string) => {
  const $Source = document.querySelector(selector)
  if (!$Source) {
    throw new Error(`Source element not found: ${selector}`)
  }
  const $Target = await waitForElement(target)
  // @ts-ignore
  $Target.moveBefore($Source, null)
}

export const attachWindowEvents = () => {
  AttachEvents.attachEvents(window, {
    [DomEventType.Blur]: ViewletLayoutEvents.handleBlur,
    [DomEventType.Focus]: ViewletLayoutEvents.handleFocus,
    [DomEventType.KeyDown]: ViewletLayoutEvents.handleKeyDown,
    [DomEventType.KeyUp]: ViewletLayoutEvents.handleKeyUp,
    [DomEventType.Resize]: ViewletLayoutEvents.handleResize,
  })
}

// TODO this code is bad
export const sendMultiple = (commands) => {
  for (const command of commands) {
    const [_, viewletId, method, ...args] = command
    switch (_) {
      case 'Css.addCssStyleSheet':
      case 'Viewlet.addCss':
      case 'Viewlet.setCss':
        // @ts-ignore
        addCssStyleSheet(viewletId, method, ...args)
        break
      case 'Viewlet.addKeyBindings':
        addKeyBindings(viewletId, method)
        break
      case 'Viewlet.append': {
        // @ts-expect-error
        append(viewletId, method, ...args)

        break
      }
      case 'Viewlet.appendToBody': {
        // @ts-expect-error
        appendToBody(viewletId, method, ...args)
        break
      }
      case 'Viewlet.appendViewlet': {
        // @ts-expect-error
        appendViewlet(viewletId, method, ...args)

        break
      }
      case 'Viewlet.ariaAnnounce': {
        ariaAnnounce(viewletId)

        break
      }
      case 'Viewlet.attachWindowEvents':
        // @ts-ignore
        attachWindowEvents(viewletId, method, ...args)
        break
      case 'Viewlet.create': {
        create(viewletId, method)

        break
      }
      case 'Viewlet.createFunctionalRoot': {
        // @ts-ignore
        createFunctionalRoot(viewletId, method, ...args)
        break
      }
      case 'Viewlet.createPlaceholder': {
        // @ts-expect-error
        createPlaceholder(viewletId, method, ...args)

        break
      }
      case 'Viewlet.dispose': {
        dispose(viewletId)

        break
      }
      case 'Viewlet.focus': {
        focus(viewletId)

        break
      }
      case 'Viewlet.focusElementByName':
        // @ts-ignore
        focusElementByName(viewletId, method, ...args)
        break
      case 'Viewlet.focusSelector':
        // @ts-ignore
        focusSelector(viewletId, method, ...args)
        break
      case 'Viewlet.focusSelector':
        // @ts-ignore
        focusSelector(viewletId, method, ...args)
        break
      case 'Viewlet.handleError': {
        // @ts-expect-error
        handleError(viewletId, method, ...args)

        break
      }
      case 'Viewlet.move':
        // @ts-ignore
        move(viewletId, method, ...args)
        break
      case 'Viewlet.registerEventListeners':
        // @ts-ignore
        VirtualDom.registerEventListeners(viewletId, method, ...args)
        break
      case 'Viewlet.removeKeyBindings':
        removeKeyBindings(viewletId)
        break
      case 'Viewlet.replaceChildren':
        // @ts-ignore
        replaceChildren(viewletId, method, ...args)
        break
      case 'Viewlet.send':
        invoke(viewletId, method, ...args)
        break
      case 'Viewlet.setBounds': {
        // @ts-expect-error
        setBounds(viewletId, method, ...args)

        break
      }
      case 'Viewlet.setCheckBoxValue':
        // @ts-ignore
        setCheckBoxValue(viewletId, method, ...args)
        break
      case 'Viewlet.setDom':
        // @ts-expect-error
        setDom(viewletId, method, ...args)
        break
      case 'Viewlet.setDom2':
        // @ts-ignore
        setDom2(viewletId, method, ...args)
        break
      case 'Viewlet.setDragData':
        // @ts-ignore
        setDragData(viewletId, method, ...args)
        break
      case 'Viewlet.setInputValues':
        // @ts-ignore
        setInputValues(viewletId, method, ...args)
        break
      case 'Viewlet.setPatches': {
        // @ts-ignore
        setPatches(viewletId, method, ...args)

        break
      }
      case 'Viewlet.setProperty':
        // @ts-ignore
        setProperty(viewletId, method, ...args)
        break
      case 'Viewlet.setSelectionByName':
        // @ts-ignore
        setSelectionByName(viewletId, method, ...args)
        break
      case 'Viewlet.setUid':
        // @ts-ignore
        setUid(viewletId, method, ...args)
        break
      case 'Viewlet.setValueByName':
        // @ts-ignore
        setValueByName(viewletId, method, ...args)
        break
      default: {
        invoke(viewletId, method, ...args)
      }
    }
  }
}

export const dispose = (id) => {
  try {
    Assert.number(id)
    const instance = getViewletInstance(id)
    if (!instance) {
      Logger.warn(`viewlet instance ${id} not found and cannot be disposed`)
      return
    }
    if (instance.factory.dispose) {
      instance.factory.dispose(instance.state)
    }
    if (instance.state.$Viewlet?.isConnected) {
      instance.state.$Viewlet.remove()
    }
    setViewletInstance(id, undefined)
  } catch {
    throw new Error(`Failed to dispose ${id}`)
  }
}

/**
 * @deprecated
 */
export const replace = () => {
  // TODO maybe check if viewlet can be recycled
}

export const handleError = (id, parentId, message) => {
  Logger.info(`[viewlet-error] ${id}: ${message}`)
  const instance = getViewletInstance(id)
  if (instance?.state.$Viewlet.isConnected) {
    instance.state.$Viewlet.remove()
  }
  if (instance?.factory?.handleError) {
    instance.factory.handleError(instance.state, message)
    return
  }
  if (instance?.state.$Viewlet) {
    instance.state.$Viewlet.textContent = `${message}`
  }
  // TODO error should bubble up to until highest possible component
  const parentInstance = getViewletInstance(parentId)
  if (parentInstance?.factory?.handleError) {
    parentInstance.factory.handleError(instance.state, message)
  }
}

/**
 * @deprecated
 */
export const appendViewlet = (parentId, childId, focus) => {
  if (parentId === 'Widget') {
    // TODO
    return
  }
  const parentInstanceState = getViewletInstance(parentId) // TODO must ensure that parent is already created
  const parentModule = parentInstanceState.factory
  const childInstance = getViewletInstance(childId)
  if (!childInstance) {
    throw new Error(`child instance ${childId} must be defined to be appended to parent ${parentId}`)
  }
  if (!parentModule) {
    throw new Error(`parent module ${parentId} must be defined to append child components`)
  }
  parentModule.appendViewlet(parentInstanceState.state, childInstance.factory.name, childInstance.state.$Viewlet)
  if (focus && childInstance.factory.focus) {
    childInstance.factory.focus(childInstance.state)
  }
}

const ariaAnnounce = async (message) => {
  const AriaAlert = await import('../AriaAlert/AriaAlert.ts')
  AriaAlert.alert(message)
}

const append = (parentId, childId, referenceNodes) => {
  Assert.number(parentId)
  Assert.number(childId)
  const parentInstance = getViewletInstance(parentId)
  if (!parentInstance) {
    throw new Error(`cannot append child: instance ${parentId} not found`)
  }
  const $Parent = parentInstance.state.$Viewlet
  const childInstance = getViewletInstance(childId)
  if (!childInstance) {
    throw new Error(`cannot append child: child instance not found ${childId}`)
  }
  const $Child = childInstance.state.$Viewlet
  if (referenceNodes) {
    // TODO this might be too inefficient
    if (childId === referenceNodes[0]) {
      $Parent.prepend($Child)
      return
    }
    for (let i = 0; i < referenceNodes.length; i++) {
      const id = referenceNodes[i]
      if (id === childId) {
        for (let j = i - 1; j >= 0; j--) {
          const beforeId = referenceNodes[j]
          const beforeInstance = getViewletInstance(beforeId)
          if (beforeInstance) {
            const $ReferenceNode = beforeInstance.state.$Viewlet
            $ReferenceNode.after($Child)
            return
          }
        }
        for (let j = i + 1; j < referenceNodes.length; j++) {
          const afterId = referenceNodes[j]
          const afterInstance = getViewletInstance(afterId)
          if (afterInstance) {
            const $ReferenceNode = afterInstance.state.$Viewlet
            $ReferenceNode.before($Child)
            return
          }
        }
      }
    }
    $Parent.append($Child)
  } else {
    $Parent.append($Child)
  }
  if (childInstance.factory?.postAppend) {
    childInstance.factory.postAppend(childInstance.state)
  }
}

const replaceChildren = (parentId, childIds) => {
  const parentInstance = getViewletInstance(parentId)
  const $Parent = parentInstance.state.$Viewlet

  const $Fragment = document.createDocumentFragment()
  for (const childId of childIds) {
    const childInstance = getViewletInstance(childId)
    const $Child = childInstance.state.$Viewlet
    $Fragment.append($Child)
  }
  $Parent.replaceChildren($Fragment)
}

const appendToBody = (childId) => {
  const $Parent = document.body
  const childInstance = getViewletInstance(childId)
  const $Child = childInstance.state.$Viewlet
  $Parent.append($Child)
}

const getFn = (command) => {
  switch (command) {
    case 'Css.addCssStyleSheet':
    case 'Viewlet.addCss':
    case 'Viewlet.setCss':
      return addCssStyleSheet
    case 'Viewlet.addKeyBindings':
      return addKeyBindings
    case 'Viewlet.append':
      return append
    case 'Viewlet.appendToBody':
      return appendToBody
    case 'Viewlet.appendViewlet':
      return appendViewlet
    case 'Viewlet.ariaAnnounce':
      return ariaAnnounce
    case 'Viewlet.attachWindowEvents':
      return attachWindowEvents
    case 'Viewlet.create':
      return create
    case 'Viewlet.createFunctionalRoot':
      return createFunctionalRoot
    case 'Viewlet.createPlaceholder':
      return createPlaceholder
    case 'Viewlet.dispose':
      return dispose
    case 'Viewlet.focus':
      return focus
    case 'Viewlet.focusElementByName':
      return focusElementByName
    case 'Viewlet.focusSelector':
      return focusSelector
    case 'Viewlet.registerEventListeners':
      return VirtualDom.registerEventListeners
    case 'Viewlet.replaceChildren':
      return replaceChildren
    case 'Viewlet.send':
      return invoke
    case 'Viewlet.setBounds':
      return setBounds
    case 'Viewlet.setCheckBoxValue':
      return setCheckBoxValue
    case 'Viewlet.setDom':
      return setDom
    case 'Viewlet.setDom2':
      return setDom2
    case 'Viewlet.setDragData':
      return setDragData
    case 'Viewlet.setInputValues':
      return setInputValues
    case 'Viewlet.setPatches':
      return setPatches
    case 'Viewlet.setProperty':
      return setProperty
    case 'Viewlet.setValueByName':
      return setValueByName
    case 'Viewlet.show':
      return show
    default:
      throw new Error(`unknown command ${command}`)
  }
}

export const executeCommands = (commands) => {
  for (const [command, ...args] of commands) {
    const fn = getFn(command)
    // @ts-ignore
    fn(...args)
  }
}

export const show = (id) => {
  const instance = getViewletInstance(id)
  const $Viewlet = instance.state.$Viewlet
  const $Workbench = document.getElementById('Workbench')
  // @ts-expect-error
  $Workbench.append($Viewlet)
  if (instance.factory.focus) {
    instance.factory.focus(instance.state)
  }
}

export const setBounds = (id, left, top, width, height) => {
  const instance = getViewletInstance(id)
  if (!instance) {
    return
  }
  const $Viewlet = instance.state.$Viewlet
  SetBounds.setBounds($Viewlet, left, top, width, height)
}

export const setProperty = (id: any, selector: string, property: string, value: any) => {
  const instance = getViewletInstance(id)
  if (!instance) {
    return
  }
  const $Viewlet = instance.state.$Viewlet
  const $Element = $Viewlet.querySelector(selector) as HTMLHtmlElement
  if (!$Element) {
    return
  }
  $Element[property] = value
}

export * from '../RegisterEventListeners/RegisterEventListeners.ts'
