import * as PerformAction2 from '../PerformAction2/PerformAction2.ts'
import * as TestFrameWork from './TestFrameWork.ts'
import * as ConditionValues from './ConditionValues.ts'

export const name = 'TestFrameWork'

export const Commands = {
  checkMultiElementCondition: TestFrameWork.checkMultiElementCondition,
  checkSingleElementCondition: TestFrameWork.checkSingleElementCondition,
  performAction: TestFrameWork.performAction,
  performAction2: PerformAction2.performAction2,
  performKeyBoardAction: TestFrameWork.performKeyBoardAction,
  showOverlay: TestFrameWork.showOverlay,
  conditionToHaveText: ConditionValues.toHaveText,
  conditionToHaveAttribute: ConditionValues.toHaveAttribute,
  conditionToHaveCount: ConditionValues.toHaveCount,
  conditionToBeFocused: ConditionValues.toBeFocused,
  conditionToHaveClass: ConditionValues.toHaveClass,
  conditionToHaveId: ConditionValues.toHaveId,
}
