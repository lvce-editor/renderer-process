import * as PerformAction2 from '../PerformAction2/PerformAction2.ts'
import * as TestFrameWork from './TestFrameWork.ts'

export const name = 'TestFrameWork'

export const Commands = {
  checkConditionError: TestFrameWork.checkConditionError,
  checkMultiElementCondition: TestFrameWork.checkMultiElementCondition,
  checkSingleElementCondition: TestFrameWork.checkSingleElementCondition,
  performAction: TestFrameWork.performAction,
  performAction2: PerformAction2.performAction2,
  performKeyBoardAction: TestFrameWork.performKeyBoardAction,
  showOverlay: TestFrameWork.showOverlay,
}
