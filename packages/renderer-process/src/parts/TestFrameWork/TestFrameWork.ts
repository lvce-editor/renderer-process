import * as Assert from '../Assert/Assert.ts'
import { performAction2 } from '../PerformAction2/PerformAction2.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import type { ConditionResult } from './ConditionResult.ts'
import * as ConditionValues from './ConditionValues.ts'
import * as ElementActions from './ElementActions.ts'
import * as GetParsedSelector from './GetParsedSelector.ts'
import * as KeyboardActions from './KeyBoardActions.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as MultiElementConditions from './MultiElementConditions.ts'
import * as QuerySelector from './QuerySelector.ts'
import * as SingleElementConditions from './SingleElementConditions.ts'

const create$Overlay = () => {
  const $TestOverlay = document.createElement('div')
  $TestOverlay.id = 'TestOverlay'
  $TestOverlay.style.position = 'fixed'
  $TestOverlay.style.bottom = '0px'
  $TestOverlay.style.left = '0px'
  $TestOverlay.style.right = '0px'
  SetBounds.setHeight($TestOverlay, 20)
  $TestOverlay.style.whiteSpace = 'nowrap'
  $TestOverlay.style.contain = 'strict'
  $TestOverlay.style.userSelect = 'text'
  $TestOverlay.style.color = 'black'
  $TestOverlay.style.display = 'flex'
  $TestOverlay.style.gap = '10px'
  return $TestOverlay


}

const createAction = (action) => {
  const $action = document.createElement('button')
  $action.textContent = action.label
  $action.style.flexShrink = '0'
  $action.style.background = 'dodgerblue'
  $action.style.paddingLeft = '6px'
  $action.style.paddingRight = '6px'
  $action.style.color = 'white'
  $action.style.border = 'none'
  $action.style.borderRadius = '5px'
  $action.addEventListener('click', () => {
    RendererWorker.send(action.command)
  })
  return $action
}


export const showOverlay = (state, background, text, actions = []) => {
  const $TestOverlay = create$Overlay()
  $TestOverlay.dataset.state = state
  $TestOverlay.style.background = background
  const span = document.createElement('span')
  span.style.flex = '1'
  span.style.overflow = 'hidden'
  span.textContent = text
  const $actions = actions.map(createAction)
  $TestOverlay.append(span, ...$actions)
  document.body.append($TestOverlay)
}

export const showTestResults = (text: string): void => {
  const existing = document.querySelector('.TestResults')
  const $TestResults = (existing || document.createElement('div')) as HTMLElement
  $TestResults.className = 'TestResults'
  $TestResults.hidden = true
  $TestResults.textContent = text
  if (!existing) {
    document.body.append($TestResults)
  }
}

export const performAction = async (locator, fnName, options) => {
  Assert.object(locator)
  Assert.string(fnName)
  Assert.object(options)
  const fn = ElementActions[fnName]
  const element = QuerySelector.querySelectorOne(locator._parsed)
  if (!element) {
    throw new Error(`element not found`)
  }
  fn(element, options)
}

export const performKeyboardAction = (fnName, options) => {
  const fn = KeyboardActions[fnName]
  fn(options)
}

export const checkSingleElementCondition = async (locator, fnName, options): Promise<ConditionResult> => {
  const fn = SingleElementConditions[fnName]
  const parsedSelector = GetParsedSelector.getParsedSelector(locator)
  const element = QuerySelector.querySelectorOne(parsedSelector)
  if (element) {
    const successful = fn(element, options)
    if (successful) {
      return { error: false }
    }
  }
  return {
    error: true,
  }
}

export const checkMultiElementCondition = async (locator, fnName, options): Promise<ConditionResult> => {
  const fn = MultiElementConditions[fnName]
  const parsedSelector = GetParsedSelector.getParsedSelector(locator)
  const elements = QuerySelector.querySelector(parsedSelector)
  const successful = fn(elements, options)
  if (successful) {
    return {
      error: false,
    }
  }
  return {
    error: true,
  }
}

export const checkConditionError = (fnName: string, ...params: readonly any[]): Promise<any> => {
  const fn = ConditionValues[fnName]
  return fn(...params)
}

export { performAction2 }
