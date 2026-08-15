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

export const handleKeyDown = (event) => {
  if (isNativeButtonActivation(event)) {
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
