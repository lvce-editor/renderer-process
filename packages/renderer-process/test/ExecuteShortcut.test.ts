import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(command: string, ...args: readonly unknown[]) => Promise<void>>()
jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({ invoke }))

const EditorEventQueue = await import('../src/parts/EditorEventQueue/EditorEventQueue.ts')
const { executeShortcut } = await import('../src/parts/ExecuteShortcut/ExecuteShortcut.ts')

test('embedding shortcuts wait for earlier input and hold later input until completion', async () => {
  const calls: string[] = []
  const inputDone = Promise.withResolvers<void>()
  const shortcutDone = Promise.withResolvers<void>()
  const first = EditorEventQueue.runInput(async () => {
    calls.push('edit')
    await inputDone.promise
  })
  invoke.mockImplementation(async () => {
    calls.push('save')
    await shortcutDone.promise
  })
  const shortcut = executeShortcut('Application.execute', 'source', 'Editor.save')
  const later = EditorEventQueue.runInput(async () => {
    calls.push('later edit')
  })
  expect(calls).toEqual(['edit'])
  inputDone.resolve()
  await first
  await Promise.resolve()
  await Promise.resolve()
  expect(invoke).toHaveBeenCalledWith('Application.execute', 'source', 'Editor.save')
  expect(calls).toEqual(['edit', 'save'])
  shortcutDone.resolve()
  await Promise.all([shortcut, later])
  expect(calls).toEqual(['edit', 'save', 'later edit'])
})

test('a rejected embedding shortcut reports its failure and releases later input', async () => {
  invoke.mockRejectedValueOnce(new Error('save failed'))
  const shortcut = executeShortcut('Application.execute', 'source', 'Editor.save')
  const later = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
  const input = EditorEventQueue.runInput(later)
  await expect(shortcut).rejects.toThrow('save failed')
  await input
  expect(later).toHaveBeenCalledTimes(1)
})
