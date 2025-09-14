import * as Assert from '../Assert/Assert.ts'
import { performAction2 } from '../PerformAction2/PerformAction2.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import type { ConditionResult } from './ConditionResult.ts'
import * as ConditionValues from './ConditionValues.ts'
import * as ElementActions from './ElementActions.ts'
import * as KeyBoardActions from './KeyBoardActions.ts'
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
  return $TestOverlay
}

export const showOverlay = (state, background, text) => {
  const $TestOverlay = create$Overlay()
  $TestOverlay.dataset.state = state
  $TestOverlay.style.background = background
  $TestOverlay.textContent = text
  document.body.append($TestOverlay)
}

export const performAction = async (locator, fnName, options) => {
  Assert.object(locator)
  Assert.string(fnName)
  Assert.object(options)
  const fn = ElementActions[fnName]
  const element = QuerySelector.querySelectorWithOptions(locator._selector, {
    hasText: locator._hasText,
    nth: locator._nth,
  })
  if (!element) {
    throw new Error(`element not found`)
  }
  if (element) {
    fn(element, options)
    return
  }
}

export const performKeyBoardAction = (fnName, options) => {
  const fn = KeyBoardActions[fnName]
  fn(options)
}

export const checkSingleElementCondition = async (locator, fnName, options): Promise<ConditionResult> => {
  const fn = SingleElementConditions[fnName]
  const element = QuerySelector.querySelectorWithOptions(locator._selector, {
    hasText: locator._hasText,
    nth: locator._nth,
  })
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
  const elements = QuerySelector.querySelector(locator._selector)
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
