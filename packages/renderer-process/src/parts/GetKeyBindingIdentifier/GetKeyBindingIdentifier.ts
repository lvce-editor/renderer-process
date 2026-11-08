import { KeyModifier, GetKeyCode } from '@lvce-editor/constants'
import * as NormalizeKey from '../NormalizeKey/NormalizeKey.ts'

export const getKeyBindingIdentifier = (event: KeyboardEvent): number => {
  const { altKey, code, ctrlKey, key, metaKey, shiftKey } = event
  const modifierControl = ctrlKey || metaKey ? KeyModifier.CtrlCmd : 0
  const modifierShift = shiftKey ? KeyModifier.Shift : 0
  const modifierAlt = altKey ? KeyModifier.Alt : 0
  const normalizedKey = shiftKey && key.length === 1 && !/[a-z0-9]/i.test(key) && code ? code : NormalizeKey.normalizeKey(key, code)
  const keyCode = GetKeyCode.getKeyCode(normalizedKey)
  const identifier = modifierControl | modifierShift | modifierAlt | keyCode
  return identifier
}
