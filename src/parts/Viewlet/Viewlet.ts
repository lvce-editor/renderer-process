import * as Assert from '../Assert/Assert.ts'
import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as KeyBindings from '../KeyBindings/KeyBindings.ts'
import * as Logger from '../Logger/Logger.ts'
import * as RememberFocus from '../RememberFocus/RememberFocus.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import { VError } from '../VError/VError.ts'
import * as ViewletModule from '../ViewletModule/ViewletModule.ts'
import { state } from '../ViewletState/ViewletState.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'


export const mount = ($Parent, state) => {
  $Parent.replaceChildren(state.$Viewlet)
}

export const create = (id, uid = id) => {
  const module = state.modules[id]
  if (!module) {
    throw new Error(`module not found: ${id}`)
  }
  if (state.instances[id]?.state.$Viewlet.isConnected) {
    state.instances[id].state.$Viewlet.remove()
  }
  const instanceState = module.create()
  ComponentUid.set(instanceState.$Viewlet, uid)
  if (module.attachEvents) {
    module.attachEvents(instanceState)
  }
  state.instances[uid] = {
    state: instanceState,
    factory: module,
  }
}

export const createFunctionalRoot = (id, uid = id) => {
  const module = state.modules[id]
  if (!module) {
    throw new Error(`module not found: ${id}`)
  }
  if (state.instances[id]?.state.$Viewlet.isConnected) {
    state.instances[id].state.$Viewlet.remove()
  }
  const instanceState = { $Viewlet: document.createElement('div') }
  state.instances[uid] = {
    state: instanceState,
    factory: module,
  }
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
  const instance = state.instances[viewletId]
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
  const instance = state.instances[viewletId]
  if (instance.factory?.setFocused) {
    instance.factory.setFocused(instance.state, true)
  } else if (instance?.factory?.focus) {
    instance.factory.focus(instance.state)
  } else {
    // TODO push focusContext
  }
}

export const focusSelector = (viewletId, selector) => {
  const instance = state.instances[viewletId]
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
  const instance = state.instances[viewletId]
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
  const instance = state.instances[viewletId]
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
  const parentInstance = state.instances[parentId]
  const $Parent = parentInstance.state.$Viewlet
  $Parent.append($PlaceHolder)
  state.instances[viewletId] = {
    state: {
      $Viewlet: $PlaceHolder,
    },
  }
}

const setDom = (viewletId, dom) => {
  const instance = state.instances[viewletId]
  if (!instance) {
    return
  }
  const { Events } = instance.factory
  const { $Viewlet } = instance.state
  VirtualDom.renderInto($Viewlet, dom, Events)
}

const setDom2 = (viewletId, dom) => {
  const instance = state.instances[viewletId]
  if (!instance) {
    return
  }
  const { Events } = instance.factory
  const { $Viewlet } = instance.state
  // TODO optimize rendering with virtual dom diffing
  const $NewViewlet = RememberFocus.rememberFocus($Viewlet, dom, Events, viewletId)
  instance.state.$Viewlet = $NewViewlet
}

// TODO this code is bad
export const sendMultiple = (commands) => {
  for (const command of commands) {
    const [_, viewletId, method, ...args] = command
    switch (_) {
      case 'Viewlet.ariaAnnounce': {
        ariaAnnounce(viewletId)

        break
      }
      case 'Viewlet.setBounds': {
        // @ts-expect-error
        setBounds(viewletId, method, ...args)

        break
      }
      case 'Viewlet.create': {
        create(viewletId, method)

        break
      }
      case 'Viewlet.createFunctionalRoot': {
        // @ts-ignore
        createFunctionalRoot(viewletId, method, ...args)
        break
      }
      case 'Viewlet.append': {
        // @ts-expect-error
        append(viewletId, method, ...args)

        break
      }
      case 'Viewlet.dispose': {
        dispose(viewletId)

        break
      }
      case 'Viewlet.createPlaceholder': {
        // @ts-expect-error
        createPlaceholder(viewletId, method, ...args)

        break
      }
      case 'Viewlet.handleError': {
        // @ts-expect-error
        handleError(viewletId, method, ...args)

        break
      }
      case 'Viewlet.focus': {
        focus(viewletId)

        break
      }
      case 'Viewlet.appendViewlet': {
        // @ts-expect-error
        appendViewlet(viewletId, method, ...args)

        break
      }
      case 'Viewlet.addKeyBindings':
        addKeyBindings(viewletId, method)
        break
      case 'Viewlet.removeKeyBindings':
        removeKeyBindings(viewletId)
        break
      case 'Viewlet.send':
        invoke(viewletId, method, ...args)
        break
      case 'Viewlet.setDom':
        // @ts-expect-error
        setDom(viewletId, method, ...args)
        break
      case 'Viewlet.setDom2':
        // @ts-ignore
        setDom2(viewletId, method, ...args)
        break
      case 'Viewlet.focusSelector':
        // @ts-ignore
        return focusSelector(viewletId, method, ...args)
      default: {
        invoke(viewletId, method, ...args)
      }
    }
  }
}

export const dispose = (id) => {
  try {
    Assert.number(id)
    const { instances } = state
    const instance = instances[id]
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
    delete instances[id]
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
  const instance = state.instances[id]
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
  const parentInstance = state.instances[parentId]
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
  const parentInstanceState = state.instances[parentId] // TODO must ensure that parent is already created
  const parentModule = parentInstanceState.factory
  const childInstance = state.instances[childId]
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
  const parentInstance = state.instances[parentId]
  if (!parentInstance) {
    throw new Error(`cannot append child: instance ${parentId} not found`)
  }
  const $Parent = parentInstance.state.$Viewlet
  const childInstance = state.instances[childId]
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
          if (state.instances[beforeId]) {
            const $ReferenceNode = state.instances[beforeId].state.$Viewlet
            $ReferenceNode.after($Child)
            return
          }
        }
        for (let j = i + 1; j < referenceNodes.length; j++) {
          const afterId = referenceNodes[j]
          if (state.instances[afterId]) {
            const $ReferenceNode = state.instances[afterId].state.$Viewlet
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

const appendToBody = (childId) => {
  const $Parent = document.body
  const childInstance = state.instances[childId]
  const $Child = childInstance.state.$Viewlet
  $Parent.append($Child)
}

const getFn = (command) => {
  switch (command) {
    case 'Viewlet.create':
      return create
    case 'Viewlet.send':
      return invoke
    case 'Viewlet.show':
      return show
    case 'Viewlet.dispose':
      return dispose
    case 'Viewlet.setDom2':
      return setDom2
    case 'Viewlet.setBounds':
      return setBounds
    case 'Viewlet.ariaAnnounce':
      return ariaAnnounce
    case 'Viewlet.append':
      return append
    case 'Viewlet.appendToBody':
      return appendToBody
    case 'Viewlet.createPlaceholder':
      return createPlaceholder
    case 'Viewlet.focus':
      return focus
    case 'Viewlet.appendViewlet':
      return appendViewlet
    case 'Viewlet.addKeyBindings':
      return addKeyBindings
    case 'Viewlet.setDom':
      return setDom
    case 'Viewlet.createFunctionalRoot':
      return createFunctionalRoot
    default:
      throw new Error(`unknown command ${command}`)
  }
}

export const executeCommands = (commands) => {
  for (const [command, ...args] of commands) {
    const fn = getFn(command)
    // @ts-expect-error
    fn(...args)
  }
}

export const show = (id) => {
  const instance = state.instances[id]
  const $Viewlet = instance.state.$Viewlet
  const $Workbench = document.getElementById('Workbench')
  // @ts-expect-error
  $Workbench.append($Viewlet)
  if (instance.factory.focus) {
    instance.factory.focus(instance.state)
  }
}

export const setBounds = (id, left, top, width, height) => {
  const instance = state.instances[id]
  if (!instance) {
    return
  }
  const $Viewlet = instance.state.$Viewlet
  SetBounds.setBounds($Viewlet, left, top, width, height)
}
