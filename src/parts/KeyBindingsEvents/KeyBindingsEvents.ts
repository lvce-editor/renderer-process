import * as Event from '../Event/Event.ts'
import * as GetKeyBindingIdentifier from '../GetKeyBindingIdentifier/GetKeyBindingIdentifier.ts'
import * as IsMatchingKeyBinding from '../IsMatchingKeyBinding/IsMatchingKeyBinding.ts'
import * as KeyBindingsState from '../KeyBindingsState/KeyBindingsState.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const handleMatchingKeyBinding = (identifier) => {
  RendererWorker.send(/* KeyBindings.handleKeyBinding */ 'KeyBindings.handleKeyBinding', /* keyBinding */ identifier)
}

export const handleKeyDown = (event) => {
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
