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
  conditionToBeFocused: ConditionValues.toBeFocused,
  conditionToHaveAttribute: ConditionValues.toHaveAttribute,
  conditionToHaveClass: ConditionValues.toHaveClass,
  conditionToHaveCount: ConditionValues.toHaveCount,
  conditionToHaveCss: ConditionValues.toHaveCss,
  conditionToHaveId: ConditionValues.toHaveId,
  conditionToHaveText: ConditionValues.toHaveText,
}
