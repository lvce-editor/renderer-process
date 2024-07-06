import * as Assert from '../Assert/Assert.ts'
import * as GetElementHeight from '../GetElementHeight/GetElementHeight.ts'

export const measureTextBlockHeight = (text, fontSize, fontFamily, width) => {
  Assert.string(text)
  Assert.string(fontSize)
  Assert.string(fontFamily)
  const $Measure = document.createElement('div')
  $Measure.style.width = `${width}px`
  $Measure.style.contain = 'content'
  $Measure.style.position = 'absolute'
  $Measure.style.top = '-9999px'
  $Measure.style.left = '-9999px'
  $Measure.textContent = text
  return GetElementHeight.getElementHeight($Measure)
}
