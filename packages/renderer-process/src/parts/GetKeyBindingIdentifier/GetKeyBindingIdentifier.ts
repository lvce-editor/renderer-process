import * as GetKeyCode from '../GetKeyCode/GetKeyCode.ts'
import { KeyModifier } from '@lvce-editor/constants'
import * as NormalizeKey from '../NormalizeKey/NormalizeKey.ts'

export const getKeyBindingIdentifier = (event: KeyboardEvent): number => {
  const { ctrlKey, shiftKey, altKey, key, code } = event
  const modifierControl = ctrlKey ? KeyModifier.CtrlCmd : 0
  const modifierShift = shiftKey ? KeyModifier.Shift : 0
  const modifierAlt = altKey ? KeyModifier.Alt : 0
  const normalizedKey = NormalizeKey.normalizeKey(key, code)
  const keyCode = GetKeyCode.getKeyCode(normalizedKey)
  const identifier = modifierControl | modifierShift | modifierAlt | keyCode
  return identifier
}
