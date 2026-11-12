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
  $Measure.style.boxSizing = 'border-box'
  $Measure.style.contain = 'content'
  // @ts-ignore
  $Measure.style.fieldSizing = 'content'
  $Measure.style.position = 'absolute'
  $Measure.style.top = '-9999px'
  $Measure.style.left = '-9999px'
  $Measure.style.fontSize = `${fontSize}px`
  $Measure.style.fontFamily = fontFamily
  $Measure.style.lineHeight = lineHeight
  $Measure.style.margin = '0'
  $Measure.style.padding = '0'
  $Measure.style.border = '0'
  $Measure.value = text
  $Measure.name = 'measureTextBlockHeight'
  const height = GetElementHeight.getElementHeight($Measure)
  return height
}
