import * as CssState from '../CssState/CssState.ts'

export const addCssStyleSheet = (id, text) => {
  const existing = CssState.get(id)
  if (existing) {
    existing.replaceSync(text)
    return
  }
  const sheet = new CSSStyleSheet({})
  CssState.set(id, sheet)
  sheet.replaceSync(text)
  document.adoptedStyleSheets.push(sheet)
}

export const getSelectionText = (): string => {
  return document.getSelection()?.toString() || ''
}
