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
import * as RendererWorkerTrace from '../RendererWorkerTrace/RendererWorkerTrace.ts'
import * as SingleElementConditions from './SingleElementConditions.ts'

const conditionTimeout = 2000
const mutationTimeout = 100

const waitForMutation = (maxDelay: number): Promise<void> => {
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      clearTimeout(timeout)
      observer.disconnect()
      resolve()
    })
    const timeout = setTimeout(() => {
      observer.disconnect()
      resolve()
    }, maxDelay)
    observer.observe(document.body, {
      attributes: true,
      characterData: true,
      childList: true,
      subtree: true,
    })
  })
}

const waitForCondition = async (check: () => boolean): Promise<ConditionResult> => {
  const endTime = performance.now() + conditionTimeout
  while (performance.now() < endTime) {
    if (check()) {
      return { error: false }
    }
    await waitForMutation(mutationTimeout)
  }
  return { error: true }
}

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
  RendererWorkerTrace.scheduleExport()
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
  RendererWorkerTrace.scheduleExport()
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
  return waitForCondition(() => {
    const element = QuerySelector.querySelectorOne(parsedSelector)
    return Boolean(element && fn(element, options))
  })
}

export const checkMultiElementCondition = async (locator, fnName, options): Promise<ConditionResult> => {
  const fn = MultiElementConditions[fnName]
  const parsedSelector = GetParsedSelector.getParsedSelector(locator)
  return waitForCondition(() => {
    const elements = QuerySelector.querySelector(parsedSelector)
    return fn(elements, options)
  })
}

export const checkConditionError = (fnName: string, ...params: readonly any[]): Promise<any> => {
  const fn = ConditionValues[fnName]
  return fn(...params)
}

export { performAction2 }
