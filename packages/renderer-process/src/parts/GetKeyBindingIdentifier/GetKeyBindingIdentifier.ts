import { KeyModifier, GetKeyCode } from '@lvce-editor/constants'
import * as NormalizeKey from '../NormalizeKey/NormalizeKey.ts'

export const getKeyBindingIdentifier = (event: KeyboardEvent): number => {
  const { altKey, code, ctrlKey, key, shiftKey } = event
  const modifierControl = ctrlKey ? KeyModifier.CtrlCmd : 0
  const modifierShift = shiftKey ? KeyModifier.Shift : 0
  const modifierAlt = altKey ? KeyModifier.Alt : 0
  const normalizedKey = NormalizeKey.normalizeKey(key, code)
  const keyCode = GetKeyCode.getKeyCode(normalizedKey)
  const identifier = modifierControl | modifierShift | modifierAlt | keyCode
  return identifier
}
