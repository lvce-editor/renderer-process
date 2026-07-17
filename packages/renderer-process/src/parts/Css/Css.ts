import * as CssState from '../CssState/CssState.ts'

export const addCssStyleSheet = (id, text) => {
  const existing = CssState.get(id)
  if (existing) {
    existing.replaceSync(text)
    CssState.setText(id, text)
    return
  }
  const sheet = new CSSStyleSheet({})
  CssState.set(id, sheet)
  CssState.setText(id, text)
  sheet.replaceSync(text)
  document.adoptedStyleSheets.push(sheet)
}

export const patchCssStyleSheet = (id, start, deleteCount, replacement) => {
  const sheet = CssState.get(id)
  const text = CssState.getText(id)
  if (!sheet || typeof text !== 'string') {
    throw new Error(`stylesheet ${id} must be initialized before it can be patched`)
  }
  if (!Number.isInteger(start) || start < 0 || start > text.length) {
    throw new TypeError('start must be an integer within the stylesheet')
  }
  if (!Number.isInteger(deleteCount) || deleteCount < 0 || start + deleteCount > text.length) {
    throw new TypeError('deleteCount must be an integer within the stylesheet')
  }
  if (typeof replacement !== 'string') {
    throw new TypeError('replacement must be a string')
  }
  const newText = text.slice(0, start) + replacement + text.slice(start + deleteCount)
  sheet.replaceSync(newText)
  CssState.setText(id, newText)
}

export const removeCssStyleSheet = (id) => {
  const sheet = CssState.get(id)
  if (!sheet) {
    return
  }
  document.adoptedStyleSheets = document.adoptedStyleSheets.filter((candidate) => candidate !== sheet)
  CssState.remove(id)
}

export const getSelectionText = (): string => {
  return document.getSelection()?.toString() || ''
}
