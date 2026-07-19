import { PlainMessagePortRpcParent, type Rpc } from '@lvce-editor/rpc'
import * as TestFrameWork from '../TestFrameWork/TestFrameWork.ts'

export const commandMap = {
  'TestFrameWork.checkConditionError': TestFrameWork.checkConditionError,
  'TestFrameWork.checkMultiElementCondition': TestFrameWork.checkMultiElementCondition,
  'TestFrameWork.checkSingleElementCondition': TestFrameWork.checkSingleElementCondition,
  'TestFrameWork.performAction': TestFrameWork.performAction,
  'TestFrameWork.performAction2': TestFrameWork.performAction2,
  'TestFrameWork.performKeyBoardAction': TestFrameWork.performKeyboardAction,
  'TestFrameWork.showOverlay': TestFrameWork.showOverlay,
  'TestFrameWork.showTestResults': TestFrameWork.showTestResults,
}

export const state: { rpc: Rpc | undefined } = {
  rpc: undefined,
}

export const initialize = async (port: MessagePort): Promise<void> => {
  const rpc = await PlainMessagePortRpcParent.create({
    commandMap,
    messagePort: port,
  })
  await state.rpc?.dispose()
  state.rpc = rpc
}
