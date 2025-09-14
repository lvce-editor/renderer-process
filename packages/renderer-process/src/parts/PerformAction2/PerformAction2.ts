import * as Assert from '../Assert/Assert.ts'
import * as ElementActions from '../TestFrameWork/ElementActions.ts'
import * as QuerySelector from '../TestFrameWork/QuerySelector.ts'

export const performAction2 = async (locator, fnName, options) => {
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
  fn(element, options)
  return
}
