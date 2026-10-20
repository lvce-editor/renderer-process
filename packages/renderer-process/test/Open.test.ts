import { expect, jest, test } from '@jest/globals'
import * as Open from '../src/parts/Open/Open.ts'

const setWindow = (open: jest.Mock, assign: jest.Mock): void => {
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      location: {
        assign,
      },
      open,
    },
  })
}

test('openUrl opens a new window by default', () => {
  const open = jest.fn()
  const assign = jest.fn()
  setWindow(open, assign)

  Open.openUrl('test://test.txt')

  expect(open).toHaveBeenCalledTimes(1)
  expect(open).toHaveBeenCalledWith('test://test.txt')
  expect(assign).not.toHaveBeenCalled()
})

test('openUrl redirects the current window when requested', () => {
  const open = jest.fn()
  const assign = jest.fn()
  setWindow(open, assign)

  Open.openUrl('test://test.txt', true)

  expect(assign).toHaveBeenCalledTimes(1)
  expect(assign).toHaveBeenCalledWith('test://test.txt')
  expect(open).not.toHaveBeenCalled()
})

for (const redirect of [false, true]) {
  test(`Tauri opens externally without navigating the editor (redirect=${redirect})`, async () => {
    const open = jest.fn()
    const assign = jest.fn()
    const invoke = jest.fn<(command: string, args: unknown) => Promise<void>>().mockResolvedValue(undefined)
    setWindow(open, assign)
    Object.assign(window, { __TAURI__: { core: { invoke } } })
    await Open.openUrl('https://example.com/authorize', redirect)
    expect(invoke).toHaveBeenCalledTimes(1)
    expect(invoke).toHaveBeenCalledWith('open_external', { url: 'https://example.com/authorize' })
    expect(open).not.toHaveBeenCalled()
    expect(assign).not.toHaveBeenCalled()
  })
}

test('Tauri propagates external browser launch failures', async () => {
  const open = jest.fn()
  const assign = jest.fn()
  const invoke = jest.fn<(command: string, args: unknown) => Promise<void>>().mockRejectedValue(new Error('Browser unavailable'))
  setWindow(open, assign)
  Object.assign(window, { __TAURI__: { core: { invoke } } })
  await expect(Open.openUrl('https://example.com/authorize', true)).rejects.toThrow('Browser unavailable')
  expect(open).not.toHaveBeenCalled()
  expect(assign).not.toHaveBeenCalled()
})
