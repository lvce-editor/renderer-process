import { beforeEach, expect, jest, test } from '@jest/globals'

const mockCreate = jest.fn<(...args: any[]) => Promise<any>>()
const mockTerminate = jest.fn()
const mockInvokeAndTransfer = jest.fn()
const mockDispose = jest.fn()

const DirectViewRpcRegistry = await import('../src/parts/DirectViewRpcRegistry/DirectViewRpcRegistry.ts')
const IpcParent = await import('../src/parts/IpcParent/IpcParent.ts')
const IpcParentWithModuleWorkerWithMessagePort =
  await import('../src/parts/IpcParentWithModuleWorkerWithMessagePort/IpcParentWithModuleWorkerWithMessagePort.ts')
const ModuleWorkerState = await import('../src/parts/ModuleWorkerState/ModuleWorkerState.ts')

beforeEach(() => {
  jest.resetAllMocks()
  DirectViewRpcRegistry.clear()
  ModuleWorkerState.clear()
  mockCreate.mockResolvedValue({
    dispose: mockDispose,
    invokeAndTransfer: mockInvokeAndTransfer,
    ipc: {
      _rawIpc: {
        terminate: mockTerminate,
      },
    },
  })
})

test('dispose terminates a registered module worker', async () => {
  await IpcParentWithModuleWorkerWithMessagePort.create(
    {
      id: 42,
      name: 'Extension API: sample.extension',
      port: {} as MessagePort,
      raw: true,
      url: 'https://example.com/extensionHostSubWorker.js',
    },
    mockCreate,
  )

  IpcParent.dispose(42)

  expect(mockTerminate).toHaveBeenCalledTimes(1)
})

test('registers the native worker rpc for a direct view', async () => {
  const rpc = await mockCreate()
  mockCreate.mockResolvedValueOnce(rpc)

  await IpcParentWithModuleWorkerWithMessagePort.create(
    {
      name: 'Main Area Worker',
      port: {} as MessagePort,
      rpcId: 'MainArea',
      url: 'https://example.com/mainAreaWorker.js',
    },
    mockCreate,
    mockCreate,
  )
  DirectViewRpcRegistry.registerView(42, 'MainArea')

  expect(DirectViewRpcRegistry.get(42)).toBe(rpc)
  expect(mockInvokeAndTransfer).toHaveBeenCalledWith('initialize', 'message-port', expect.anything())
})

test('dispose removes the registered worker', async () => {
  await IpcParentWithModuleWorkerWithMessagePort.create(
    {
      id: 42,
      name: 'Extension API: sample.extension',
      port: {} as MessagePort,
      raw: true,
      url: 'https://example.com/extensionHostSubWorker.js',
    },
    mockCreate,
  )

  IpcParent.dispose(42)
  IpcParent.dispose(42)

  expect(mockTerminate).toHaveBeenCalledTimes(1)
})

test('create without an id does not register the worker', async () => {
  await IpcParentWithModuleWorkerWithMessagePort.create(
    {
      name: 'Extension API',
      port: {} as MessagePort,
      raw: true,
      url: 'https://example.com/extensionHostSubWorker.js',
    },
    mockCreate,
  )

  IpcParent.dispose(42)

  expect(mockTerminate).not.toHaveBeenCalled()
})

test('create without raw mode does not register the worker', async () => {
  await IpcParentWithModuleWorkerWithMessagePort.create(
    {
      id: 42,
      name: 'Editor Worker',
      port: {} as MessagePort,
      url: 'https://example.com/editorWorker.js',
    },
    mockCreate,
  )

  IpcParent.dispose(42)

  expect(mockTerminate).not.toHaveBeenCalled()
})
