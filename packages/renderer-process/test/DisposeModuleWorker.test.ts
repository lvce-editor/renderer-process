import { beforeEach, expect, jest, test } from '@jest/globals'

const mockCreate = jest.fn<(...args: any[]) => Promise<any>>()
const mockTerminate = jest.fn()

const IpcParent = await import('../src/parts/IpcParent/IpcParent.ts')
const IpcParentWithModuleWorkerWithMessagePort = await import(
  '../src/parts/IpcParentWithModuleWorkerWithMessagePort/IpcParentWithModuleWorkerWithMessagePort.ts'
)
const ModuleWorkerState = await import('../src/parts/ModuleWorkerState/ModuleWorkerState.ts')

beforeEach(() => {
  jest.resetAllMocks()
  ModuleWorkerState.clear()
  mockCreate.mockResolvedValue({
    ipc: {
      _rawIpc: {
        terminate: mockTerminate,
      },
    },
  })
})

test('dispose terminates a registered module worker', async () => {
  await IpcParentWithModuleWorkerWithMessagePort.create({
    id: 42,
    name: 'Extension API: sample.extension',
    port: {} as MessagePort,
    url: 'https://example.com/extensionHostSubWorker.js',
  }, mockCreate)

  IpcParent.dispose(42)

  expect(mockTerminate).toHaveBeenCalledTimes(1)
})

test('dispose removes the registered worker', async () => {
  await IpcParentWithModuleWorkerWithMessagePort.create({
    id: 42,
    name: 'Extension API: sample.extension',
    port: {} as MessagePort,
    url: 'https://example.com/extensionHostSubWorker.js',
  }, mockCreate)

  IpcParent.dispose(42)
  IpcParent.dispose(42)

  expect(mockTerminate).toHaveBeenCalledTimes(1)
})

test('create without an id does not register the worker', async () => {
  await IpcParentWithModuleWorkerWithMessagePort.create({
    name: 'Extension API',
    port: {} as MessagePort,
    url: 'https://example.com/extensionHostSubWorker.js',
  }, mockCreate)

  IpcParent.dispose(42)

  expect(mockTerminate).not.toHaveBeenCalled()
})
