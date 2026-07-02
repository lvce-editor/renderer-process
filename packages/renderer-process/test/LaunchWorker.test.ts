import { beforeEach, expect, jest, test } from '@jest/globals'

const mockCreate = jest.fn<(...args: any[]) => Promise<any>>()

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('@lvce-editor/rpc', () => {
  return {
    ModuleWorkerRpcParent: {
      create: mockCreate,
    },
  }
})

const LaunchWorker = await import('../src/parts/LaunchWorker/LaunchWorker.ts')

test('launchWorker - success result', async () => {
  const rpc = {
    invoke: jest.fn(),
  }
  mockCreate.mockResolvedValue(rpc)

  const result = await LaunchWorker.launchWorker({
    name: 'Renderer Worker',
    url: '/test/worker.js',
  })

  expect(result).toEqual({
    ok: true,
    value: rpc,
  })
  expect(mockCreate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'Renderer Worker',
      url: '/test/worker.js',
    }),
  )
})

test('launchWorker - error result', async () => {
  const error = new Error('Worker Launch Error')
  mockCreate.mockRejectedValue(error)

  const result = await LaunchWorker.launchWorker({
    name: 'Renderer Worker',
    url: '/test/worker.js',
  })

  expect(result).toEqual({
    ok: false,
    error,
  })
})
