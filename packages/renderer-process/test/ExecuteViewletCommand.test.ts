import { expect, jest, test } from '@jest/globals'

const send = jest.fn()

jest.unstable_mockModule('../src/parts/ViewletEventRouter/ViewletEventRouter.ts', () => ({
  send,
}))

const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts')

test('routes the command through the viewlet event router', () => {
  ExecuteViewletCommand.executeViewletCommand(42, 'handleMenuClick', 0, 14)

  expect(send).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleMenuClick', 0, 14)
})
