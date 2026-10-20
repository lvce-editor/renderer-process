import { expect, test } from '@jest/globals'
import * as EditorEventQueue from '../src/parts/EditorEventQueue/EditorEventQueue.ts'

const drain = async () => {
  await EditorEventQueue.runShortcut(async () => {})
  await Promise.resolve()
}

test('orders input before and after a delayed shortcut while preserving concurrent bursts', async () => {
  const calls: string[] = []
  const inputDone = Promise.withResolvers<void>()
  const shortcutDone = Promise.withResolvers<void>()
  const first = EditorEventQueue.runInput(async () => {
    calls.push('first input')
    await inputDone.promise
  })
  const shortcut = EditorEventQueue.runShortcut(async () => {
    calls.push('shortcut')
    await shortcutDone.promise
  })
  const second = EditorEventQueue.runInput(async () => {
    calls.push('second input')
  })
  const third = EditorEventQueue.runInput(async () => {
    calls.push('third input')
  })
  expect(calls).toEqual(['first input'])
  inputDone.resolve()
  await first
  await Promise.resolve()
  await Promise.resolve()
  expect(calls).toEqual(['first input', 'shortcut'])
  shortcutDone.resolve()
  await Promise.all([shortcut, second, third])
  expect(calls).toEqual(['first input', 'shortcut', 'second input', 'third input'])
  await drain()
  expect(EditorEventQueue.hasPending()).toBe(false)
})

test('keeps an intervening input between two shortcuts', async () => {
  const calls: string[] = []
  const firstDone = Promise.withResolvers<void>()
  const first = EditorEventQueue.runShortcut(async () => {
    calls.push('first shortcut')
    await firstDone.promise
  })
  const input = EditorEventQueue.runInput(async () => {
    calls.push('input')
  })
  const second = EditorEventQueue.runShortcut(async () => {
    calls.push('second shortcut')
  })
  firstDone.resolve()
  await Promise.all([first, input, second])
  expect(calls).toEqual(['first shortcut', 'input', 'second shortcut'])
  await drain()
})

test('a failed input or shortcut does not strand subsequent input', async () => {
  await expect(
    EditorEventQueue.runInput(async () => {
      throw new Error('input failed')
    }),
  ).rejects.toThrow('input failed')
  const shortcut = EditorEventQueue.runShortcut(async () => {
    throw new Error('shortcut failed')
  })
  const input = EditorEventQueue.runInput(async () => {})
  await expect(shortcut).rejects.toThrow('shortcut failed')
  await input
  await drain()
  expect(EditorEventQueue.hasPending()).toBe(false)
})
