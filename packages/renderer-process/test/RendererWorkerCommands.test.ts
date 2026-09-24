import { expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<unknown>>()
jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({ invoke }))
const RendererWorkerCommands = await import('../src/parts/RendererWorkerCommands/RendererWorkerCommands.ts')

test('openUri forwards to the renderer worker', async () => {
  const uri = 'file:///tmp/example.txt'
  await RendererWorkerCommands.openUri(uri)
  expect(invoke).toHaveBeenCalledWith('Main.openUri', uri)
})

test('setUri forwards to the renderer worker', async () => {
  const uri = 'file:///tmp/workspace'
  await RendererWorkerCommands.setUri(uri)
  expect(invoke).toHaveBeenCalledWith('Workspace.setUri', uri)
})
