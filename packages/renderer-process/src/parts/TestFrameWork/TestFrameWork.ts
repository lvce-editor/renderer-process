import * as Assert from '../Assert/Assert.ts'
import * as SetBounds from '../SetBounds/SetBounds.ts'
import * as Time from '../Time/Time.ts'
import * as Timeout from '../Timeout/Timeout.ts'
import { ConditionResult } from './ConditionResult.ts'
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

const maxTimeout = 2000

export const performAction = async (locator, fnName, options) => {
  Assert.object(locator)
  Assert.string(fnName)
  Assert.object(options)
  const startTime = Time.getTimeStamp()
  const endTime = startTime + maxTimeout
  let currentTime = startTime
  const fn = ElementActions[fnName]
  while (currentTime < endTime) {
    const element = QuerySelector.querySelectorWithOptions(locator._selector, {
      hasText: locator._hasText,
      nth: locator._nth,
    })
    if (element) {
      fn(element, options)
      return
    }
    await Timeout.waitForMutation(100)
    currentTime = Time.getTimeStamp()
  }
}

export const performKeyBoardAction = (fnName, options) => {
  const fn = KeyBoardActions[fnName]
  fn(options)
}

export const checkSingleElementCondition = async (locator, fnName, options): Promise<ConditionResult> => {
  const startTime = Time.getTimeStamp()
  const endTime = startTime + maxTimeout
  let currentTime = startTime
  const fn = SingleElementConditions[fnName]
  while (currentTime < endTime) {
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
    await Timeout.waitForMutation(100)
    currentTime = Time.getTimeStamp()
  }
  return {
    error: true,
  }
}

export const checkMultiElementCondition = async (locator, fnName, options): Promise<ConditionResult> => {
  const startTime = Time.getTimeStamp()
  const endTime = startTime + maxTimeout
  let currentTime = startTime
  const fn = MultiElementConditions[fnName]
  while (currentTime < endTime) {
    const elements = QuerySelector.querySelector(locator._selector)
    const successful = fn(elements, options)
    if (successful) {
      return {
        error: false,
      }
    }
    await Timeout.waitForMutation(100)
    currentTime = Time.getTimeStamp()
  }
  return {
    error: true,
  }
}
