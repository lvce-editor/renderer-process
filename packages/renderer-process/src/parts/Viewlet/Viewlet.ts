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

const emptyFocusCallback = {
  id: 0,
  selector: '',
}

let focusCallback = emptyFocusCallback

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
  if ($Element && $Element instanceof HTMLElement) {
    if ($Element.isConnected) {
      $Element.focus()
    } else {
      focusCallback = {
        id: viewletId,
        selector,
      }
    }
  }
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
  applyLateFocusMaybe()
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
  executeCommands(commands)
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

const prependChild = ($Parent, $Child) => {
  $Parent.prepend($Child)
  return true
}

const appendAfterPreviousReference = (referenceNodes, childIndex, $Child) => {
  for (let i = childIndex - 1; i >= 0; i--) {
    const beforeId = referenceNodes[i]
    const beforeInstance = getViewletInstance(beforeId)
    if (beforeInstance) {
      const $ReferenceNode = beforeInstance.state.$Viewlet
      $ReferenceNode.after($Child)
      return true
    }
  }
  return false
}

const appendBeforeNextReference = (referenceNodes, childIndex, $Child) => {
  for (let i = childIndex + 1; i < referenceNodes.length; i++) {
    const afterId = referenceNodes[i]
    const afterInstance = getViewletInstance(afterId)
    if (afterInstance) {
      const $ReferenceNode = afterInstance.state.$Viewlet
      $ReferenceNode.before($Child)
      return true
    }
  }
  return false
}

const appendWithReferenceNodes = ($Parent, $Child, childId, referenceNodes) => {
  if (childId === referenceNodes[0]) {
    return prependChild($Parent, $Child)
  }
  const childIndex = referenceNodes.indexOf(childId)
  if (childIndex === -1) {
    $Parent.append($Child)
    return false
  }
  if (appendAfterPreviousReference(referenceNodes, childIndex, $Child)) {
    return true
  }
  if (appendBeforeNextReference(referenceNodes, childIndex, $Child)) {
    return true
  }
  $Parent.append($Child)
  return false
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
    if (appendWithReferenceNodes($Parent, $Child, childId, referenceNodes)) {
      return
    }
  } else {
    $Parent.append($Child)
  }
  if (childInstance.factory?.postAppend) {
    childInstance.factory.postAppend(childInstance.state)
  }

  applyLateFocusMaybe()
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

const applyLateFocusMaybe = () => {
  if (focusCallback !== emptyFocusCallback) {
    const { id, selector } = focusCallback
    focusCallback = emptyFocusCallback
    const instance = getViewletInstance(id)
    if (instance) {
      const { $Viewlet } = instance.state
      const $Element = $Viewlet.querySelector(selector)
      if ($Element) {
        $Element.focus()
        focusCallback = emptyFocusCallback
      }
    }
  }
}

const appendToBody = (childId) => {
  const $Parent = document.body
  const childInstance = getViewletInstance(childId)
  const $Child = childInstance.state.$Viewlet
  $Parent.append($Child)
  applyLateFocusMaybe()
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

const commandHandlers = {
  'Css.addCssStyleSheet': addCssStyleSheet,
  'Viewlet.addCss': addCssStyleSheet,
  'Viewlet.addKeyBindings': addKeyBindings,
  'Viewlet.append': append,
  'Viewlet.appendToBody': appendToBody,
  'Viewlet.appendViewlet': appendViewlet,
  'Viewlet.ariaAnnounce': ariaAnnounce,
  'Viewlet.attachWindowEvents': attachWindowEvents,
  'Viewlet.create': create,
  'Viewlet.createFunctionalRoot': createFunctionalRoot,
  'Viewlet.createPlaceholder': createPlaceholder,
  'Viewlet.dispose': dispose,
  'Viewlet.focus': focus,
  'Viewlet.focusElementByName': focusElementByName,
  'Viewlet.focusSelector': focusSelector,
  'Viewlet.handleError': handleError,
  'Viewlet.move': move,
  'Viewlet.registerEventListeners': VirtualDom.registerEventListeners,
  'Viewlet.removeKeyBindings': removeKeyBindings,
  'Viewlet.replaceChildren': replaceChildren,
  'Viewlet.send': invoke,
  'Viewlet.setBounds': setBounds,
  'Viewlet.setCheckBoxValue': setCheckBoxValue,
  'Viewlet.setCss': addCssStyleSheet,
  'Viewlet.setDom': setDom,
  'Viewlet.setDom2': setDom2,
  'Viewlet.setDragData': setDragData,
  'Viewlet.setInputValues': setInputValues,
  'Viewlet.setPatches': setPatches,
  'Viewlet.setProperty': setProperty,
  'Viewlet.setSelectionByName': setSelectionByName,
  'Viewlet.setUid': setUid,
  'Viewlet.setValueByName': setValueByName,
  'Viewlet.show': show,
}

const getFn = (command) => {
  const fn = commandHandlers[command]
  if (!fn) {
    throw new Error(`unknown command ${command}`)
  }
  return fn
}

export * from '../RegisterEventListeners/RegisterEventListeners.ts'
