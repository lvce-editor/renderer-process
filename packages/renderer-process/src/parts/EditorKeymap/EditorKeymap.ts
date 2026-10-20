import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

interface Binding {
  readonly args?: readonly unknown[]
  readonly command?: string
  readonly mode?: string
}

interface Mode {
  readonly bindings: Readonly<Record<string, Binding>>
  readonly captureText?: boolean
}

export interface Keymap {
  readonly cursorStyle?: 'block' | 'line'
  readonly initialMode: string
  readonly modes: Readonly<Record<string, Mode>>
}

interface Registration {
  readonly beforeInput: (event: InputEvent) => void
  readonly cursorStyles: readonly { readonly name: string; readonly value: string; readonly priority: string }[]
  readonly id: number
  readonly keymap: Keymap
  mode: string
  readonly root: HTMLElement
}

const registrations = new Map<string, Registration>()

const getRegistration = (target: EventTarget | null): Registration | undefined => {
  if (!(target instanceof HTMLTextAreaElement) || !target.matches('.EditorInput textarea') || !target.closest('.Editor')) return undefined
  const root = target.closest('[id^="Workbench-"]')
  return root ? registrations.get(root.id) : undefined
}

export const register = (rootId: string, id: number, keymap: Keymap): void => {
  const root = document.getElementById(rootId)
  if (!root) throw new Error(`Editor keymap root not found: ${rootId}`)
  if (registrations.has(rootId)) throw new Error(`Editor keymap already registered: ${rootId}`)
  if (!Object.hasOwn(keymap.modes, keymap.initialMode)) throw new Error('Unknown initial editor keymap mode')
  for (const mode of Object.values(keymap.modes)) {
    for (const binding of Object.values(mode.bindings)) {
      if (binding.mode !== undefined && !Object.hasOwn(keymap.modes, binding.mode)) throw new Error('Unknown editor keymap mode')
    }
  }
  const cursorStyles = ['--EditorCursorWidth', '--EditorCursorOpacity'].map((name) => ({
    name,
    priority: root.style.getPropertyPriority(name),
    value: root.style.getPropertyValue(name),
  }))
  if (keymap.cursorStyle !== undefined) {
    root.style.setProperty('--EditorCursorWidth', keymap.cursorStyle === 'block' ? '1ch' : '2px')
    root.style.setProperty('--EditorCursorOpacity', keymap.cursorStyle === 'block' ? '0.5' : '1')
  }
  const beforeInput = (event: InputEvent): void => {
    const registration = getRegistration(event.target)
    if (registration?.keymap.modes[registration.mode]?.captureText) {
      event.preventDefault()
      event.stopImmediatePropagation()
    }
  }
  registrations.set(rootId, { beforeInput, cursorStyles, id, keymap, mode: keymap.initialMode, root })
  root.addEventListener('beforeinput', beforeInput, { capture: true })
}

export const remove = (rootId: string, id: number): void => {
  const registration = registrations.get(rootId)
  if (registration?.id !== id) return
  registration.root.removeEventListener('beforeinput', registration.beforeInput, true)
  if (registration.keymap.cursorStyle !== undefined) {
    for (const { name, priority, value } of registration.cursorStyles) {
      if (value) registration.root.style.setProperty(name, value, priority)
      else registration.root.style.removeProperty(name)
    }
  }
  registrations.delete(rootId)
}

// Resolve mode transitions before the browser can produce the next input event.
export const handleKeyDown = (event: KeyboardEvent): boolean => {
  const registration = getRegistration(event.target)
  if (!registration || event.altKey || event.ctrlKey || event.metaKey || event.isComposing) return false
  const mode = registration.keymap.modes[registration.mode]
  if (!mode) return false
  const binding = Object.hasOwn(mode.bindings, event.key) ? mode.bindings[event.key] : undefined
  if (!binding && !(mode.captureText && (event.key.length === 1 || ['Enter', 'Backspace', 'Delete'].includes(event.key)))) return false
  event.preventDefault()
  if (binding?.mode !== undefined) registration.mode = binding.mode
  if (binding?.command) {
    RendererWorker.send('EditorKeymap.execute', registration.id, binding.command, ...(binding.args || []))
  }
  return true
}
