import * as Assert from '../Assert/Assert.ts'

// Measuring a prefix in isolation changes Arabic joining and ligatures. Use a
// native Range within the full directional run to retain the shaping context.
export const measurePrefix = (
  text: string,
  offset: number,
  fontWeight: number,
  fontSize: number,
  fontFamily: string,
  letterSpacing: number,
  direction: 'rtl' | 'ltr',
): number => {
  Assert.string(text)
  Assert.number(offset)
  Assert.number(fontWeight)
  Assert.number(fontSize)
  Assert.string(fontFamily)
  Assert.number(letterSpacing)
  const element = document.createElement('span')
  element.style.position = 'fixed'
  element.style.visibility = 'hidden'
  element.style.whiteSpace = 'pre'
  element.style.fontWeight = String(fontWeight)
  element.style.fontSize = `${fontSize}px`
  element.style.fontFamily = fontFamily
  element.style.letterSpacing = `${letterSpacing}px`
  element.style.direction = direction
  element.style.unicodeBidi = 'bidi-override'
  element.textContent = text
  document.body.append(element)
  try {
    if (!element.firstChild) {
      return 0
    }
    const range = document.createRange()
    range.setStart(element.firstChild, 0)
    const end = Math.max(0, Math.min(text.length, Math.trunc(offset)))
    range.setEnd(element.firstChild, end)
    return range.getBoundingClientRect().width
  } finally {
    element.remove()
  }
}
