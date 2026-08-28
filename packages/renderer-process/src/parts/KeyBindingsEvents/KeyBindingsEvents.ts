import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as Event from '../Event/Event.ts'
import * as GetKeyBindingIdentifier from '../GetKeyBindingIdentifier/GetKeyBindingIdentifier.ts'
import * as IsMatchingKeyBinding from '../IsMatchingKeyBinding/IsMatchingKeyBinding.ts'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const handleMatchingKeyBinding = (identifier) => {
  RendererWorker.send(/* KeyBindings.handleKeyBinding */ 'KeyBindings.handleKeyBinding', /* keyBinding */ identifier)
}

const isNativeButtonActivation = (event): boolean => {
  const { altKey, ctrlKey, key, metaKey, shiftKey, target } = event
  if (altKey || ctrlKey || metaKey || shiftKey) {
    return false
  }
  return target instanceof HTMLButtonElement && target.role !== AriaRoles.MenuItem && (key === 'Enter' || key === ' ')
}

const isTerminalTextInput = (event): boolean => {
  const { altKey, ctrlKey, key, metaKey, target } = event
  if (altKey || ctrlKey || metaKey || key.length !== 1) {
    return false
  }
  return target instanceof Element && Boolean(target.closest('.XtermTerminal'))
}

export const handleKeyDown = (event) => {
  if (isNativeButtonActivation(event) || isTerminalTextInput(event)) {
    return
  }
  const identifier = GetKeyBindingIdentifier.getKeyBindingIdentifier(event)
  const identifiers = KeyBindingsState.getIdentifiers()
  const matchingKeyBinding = IsMatchingKeyBinding.isMatchingKeyBinding(identifiers, identifier)
  if (!matchingKeyBinding) {
    return
  }
  Event.preventDefault(event)
  handleMatchingKeyBinding(identifier)
}

export const handleKeyUp = (event) => {}
