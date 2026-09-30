import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'
import * as WorkerRegistry from '../src/parts/WorkerRegistry/WorkerRegistry.ts'

const mockCreate = jest.fn<(...args: any[]) => Promise<any>>()

beforeEach(() => {
  jest.resetAllMocks()
})

afterEach(() => {
  WorkerRegistry.terminateAll()
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
      name: expect.stringMatching(/^\[worker-\d+\] Renderer Worker$/),
      url: '/test/worker.js',
    }),
  )
})

test('launchWorker - uses the tracked runtime name for the worker and registry', async () => {
  const launchedWorkerNames: string[] = []
  mockCreate.mockImplementation(async ({ name }) => {
    const worker = { name, terminate: jest.fn() }
    launchedWorkerNames.push(name)
    return { ipc: { _rawIpc: worker } }
  })

  await LaunchWorker.launchWorker({ name: 'Renderer Worker (Electron)', url: '/test/worker.js' })
  await LaunchWorker.launchWorker({ name: 'Renderer Worker (Electron)', url: '/test/worker.js' })

  const trackedWorkers = WorkerRegistry.getWorkers()
  expect(trackedWorkers).toHaveLength(2)
  expect(trackedWorkers[0].runtimeName).toBe(launchedWorkerNames[0])
  expect(trackedWorkers[1].runtimeName).toBe(launchedWorkerNames[1])
  expect(trackedWorkers[0].name).toBe('Renderer Worker (Electron)')
  expect(trackedWorkers[1].name).toBe('Renderer Worker (Electron)')
  expect(launchedWorkerNames[0]).not.toBe(launchedWorkerNames[1])
  expect(launchedWorkerNames[0]).toMatch(/^\[worker-\d+\] Renderer Worker \(Electron\)$/)
})

test('launchWorker - error result', async () => {
  const error = new Error('Worker Launch Error')
  mockCreate.mockRejectedValue(error)

  const result = await LaunchWorker.launchWorker({
    name: 'Renderer Worker',
    url: '/test/worker.js',
  })

  expect(result).toEqual({
    error,
    ok: false,
  })
})
