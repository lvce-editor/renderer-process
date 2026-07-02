import { beforeEach, expect, jest, test } from '@jest/globals'

const mockLaunchRendererWorker = jest.fn<(...args: any[]) => Promise<any>>()
const mockLaunchEditorWorker = jest.fn<(...args: any[]) => Promise<any>>()

class MockMessageChannel {
  port1 = {}
  port2 = {}
}

const createRpc = () => {
  return {
    dispose: jest.fn(async () => {}),
    invoke: jest.fn(async () => {}),
    invokeAndTransfer: jest.fn(async () => {}),
    send: jest.fn(),
  }
}

beforeEach(() => {
  jest.resetAllMocks()
  Object.defineProperty(globalThis, 'MessageChannel', {
    configurable: true,
    value: MockMessageChannel,
  })
})

jest.unstable_mockModule('../src/parts/LaunchRendererWorker/LaunchRendererWorker.ts', () => {
  return {
    launchRendererWorker: mockLaunchRendererWorker,
  }
})

jest.unstable_mockModule('../src/parts/LaunchEditorWorker/LaunchEditorWorker.ts', () => {
  return {
    launchEditorWorker: mockLaunchEditorWorker,
  }
})

const EditorWorker = await import('../src/parts/EditorWorker/EditorWorker.ts')
const IpcStates = await import('../src/parts/IpcStates/IpcStates.ts')
const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.ts')

beforeEach(() => {
  RendererWorker.state.rpc = undefined
  IpcStates.remove('Editor Worker')
})

test('RendererWorker.hydrate - stores rpc on success', async () => {
  const rpc = createRpc()
  mockLaunchRendererWorker.mockResolvedValue({
    ok: true,
    value: rpc,
  })

  const result = await RendererWorker.hydrate()

  expect(result).toEqual({
    ok: true,
    value: undefined,
  })
  expect(RendererWorker.state.rpc).toBe(rpc)
})

test('RendererWorker.hydrate - clears rpc on error', async () => {
  const error = new Error('Failed to start renderer worker')
  RendererWorker.state.rpc = createRpc()
  mockLaunchRendererWorker.mockResolvedValue({
    ok: false,
    error,
  })

  const result = await RendererWorker.hydrate()

  expect(result).toEqual({
    ok: false,
    error,
  })
  expect(RendererWorker.state.rpc).toBeUndefined()
})

test('EditorWorker.hydrate - removes ipc state on error', async () => {
  const error = new Error('Failed to start editor worker')
  mockLaunchEditorWorker.mockResolvedValue({
    ok: false,
    error,
  })

  const result = await EditorWorker.hydrate()

  expect(result).toEqual({
    ok: false,
    error,
  })
  expect(IpcStates.has('Editor Worker')).toBeFalsy()
})
