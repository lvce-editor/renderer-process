import type { Rpc } from '@lvce-editor/rpc'
import { afterEach, expect, jest, test } from '@jest/globals'
import * as TestFrameWork from '../src/parts/TestFrameWork/TestFrameWork.ts'

const dispose = jest.fn(async (): Promise<void> => undefined)
const rpc = {
  dispose,
} as unknown as Rpc
const create = jest.fn<(_options: any) => Promise<Rpc>>(async () => rpc)

jest.unstable_mockModule('@lvce-editor/rpc', () => ({
  PlainMessagePortRpcParent: {
    create,
  },
}))

const TestWorkerRpc = await import('../src/parts/TestWorkerRpc/TestWorkerRpc.ts')

afterEach(() => {
  TestWorkerRpc.state.rpc = undefined
  create.mockClear()
  dispose.mockClear()
})

test('initialize creates a direct rpc with renderer-local test framework commands', async () => {
  const port = {} as MessagePort

  await TestWorkerRpc.initialize(port)

  expect(create).toHaveBeenCalledTimes(1)
  expect(create).toHaveBeenCalledWith({
    commandMap: {
      'TestFrameWork.checkConditionError': TestFrameWork.checkConditionError,
      'TestFrameWork.checkMultiElementCondition': TestFrameWork.checkMultiElementCondition,
      'TestFrameWork.checkSingleElementCondition': TestFrameWork.checkSingleElementCondition,
      'TestFrameWork.performAction': TestFrameWork.performAction,
      'TestFrameWork.performAction2': TestFrameWork.performAction2,
      'TestFrameWork.performKeyBoardAction': TestFrameWork.performKeyboardAction,
      'TestFrameWork.showOverlay': TestFrameWork.showOverlay,
      'TestFrameWork.showTestResults': TestFrameWork.showTestResults,
    },
    messagePort: port,
  })
  expect(TestWorkerRpc.state.rpc).toBe(rpc)
})

test('initialize disposes the previous direct rpc', async () => {
  TestWorkerRpc.state.rpc = rpc

  await TestWorkerRpc.initialize({} as MessagePort)

  expect(dispose).toHaveBeenCalledTimes(1)
})
