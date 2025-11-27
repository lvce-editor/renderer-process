import * as Assert from '../Assert/Assert.ts'
import * as GetElementHeight from '../GetElementHeight/GetElementHeight.ts'

export const measureTextBlockHeight = (text: string, fontSize: number, fontFamily: string, lineHeight: string, width: number): number => {
  Assert.string(text)
  Assert.number(fontSize)
  Assert.string(fontFamily)
  Assert.number(width)
  Assert.string(lineHeight)
  const $Measure = document.createElement('textarea')
  $Measure.style.width = `${width}px`
  $Measure.style.contain = 'content'
  $Measure.style.position = 'absolute'
  $Measure.style.top = '-9999px'
  $Measure.style.left = '-9999px'
  $Measure.style.fontSize = `${fontSize}px`
  $Measure.style.lineHeight = lineHeight
  $Measure.value = text
  const height = GetElementHeight.getElementHeight($Measure)
  return height
}
