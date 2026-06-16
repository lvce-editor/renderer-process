import * as PerformAction2 from '../PerformAction2/PerformAction2.ts'
import * as TestFramework from './TestFrameWork.ts'

export const name = 'TestFrameWork'

export const Commands = {
  checkConditionError: TestFramework.checkConditionError,
  checkMultiElementCondition: TestFramework.checkMultiElementCondition,
  checkSingleElementCondition: TestFramework.checkSingleElementCondition,
  performAction: TestFramework.performAction,
  performAction2: PerformAction2.performAction2,
  performKeyboardAction: TestFramework.performKeyboardAction,
  showOverlay: TestFramework.showOverlay,
}
