import * as Assert from '../Assert/Assert.ts'
import * as Time from '../Time/Time.ts'
import * as Timeout from '../Timeout/Timeout.ts'
import * as ElementActions from '../TestFrameWork/ElementActions.ts'
import * as QuerySelector from '../TestFrameWork/QuerySelector.ts'

// TODO this should also come in via options
const maxTimeout = 2000

export const performAction2 = async (locator, fnName, options) => {
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
