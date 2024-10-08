import * as Assert from '../Assert/Assert.ts'
import * as GetElementHeight from '../GetElementHeight/GetElementHeight.ts'

export const measureTextBlockHeight = (text, fontSize, fontFamily, lineHeight, width) => {
  Assert.string(text)
  Assert.number(fontSize)
  Assert.string(fontFamily)
  Assert.number(width)
  Assert.string(lineHeight)
  const $Measure = document.createElement('div')
  $Measure.style.width = `${width}px`
  $Measure.style.contain = 'content'
  $Measure.style.position = 'absolute'
  $Measure.style.top = '-9999px'
  $Measure.style.left = '-9999px'
  $Measure.style.fontSize = `${fontSize}px`
  $Measure.style.lineHeight = lineHeight
  $Measure.textContent = text
  return GetElementHeight.getElementHeight($Measure)
}
