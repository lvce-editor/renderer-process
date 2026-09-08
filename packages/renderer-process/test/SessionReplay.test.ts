/** @jest-environment jsdom */
import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<any>>().mockResolvedValue('session-id')
const dispose = jest.fn()
const stop = jest.fn()
const observe = jest.fn(() => stop)
const frame = { dom: { children: [], tag: 'body' }, styles: [], viewport: [800, 600] }
const capture = jest.fn(() => frame)
const proxyPort = { close: jest.fn() }
const invokeAndTransfer = jest.fn<(...args: readonly unknown[]) => Promise<any>>().mockResolvedValue(proxyPort)
const createClient = jest.fn(() => ({ dispose, invoke, invokeAndTransfer }))
const proxyDispose = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
const originalDispose = jest.fn<() => Promise<void>>().mockResolvedValue(undefined)
const originalRpc = { dispose: originalDispose }
const rendererState: { rpc: any } = { rpc: originalRpc }
const createRpc = jest.fn<(...args: readonly unknown[]) => Promise<any>>().mockResolvedValue({ dispose: proxyDispose })
jest.unstable_mockModule('@lvce-editor/rpc', () => ({ PlainMessagePortRpcParent: { create: createRpc } }))
jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({ state: rendererState }))
jest.unstable_mockModule('../src/parts/CommandMapRef/CommandMapRef.ts', () => ({ commandMapRef: {} }))
const mountPlayer = jest.fn()
jest.unstable_mockModule('@lvce-editor/session-replay-worker/capture', () => ({ capture, observe }))
jest.unstable_mockModule('@lvce-editor/session-replay-worker/client', () => ({ createClient }))
jest.unstable_mockModule('@lvce-editor/session-replay-worker/player', () => ({ mountPlayer }))
const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.ts')
const disabled = { endpoint: '', local: false, upload: false }
const enabled = { endpoint: '', local: true, upload: false }
const createPort = (): MessagePort => ({ close: jest.fn() }) as unknown as MessagePort

beforeEach(async () => {
  await SessionReplay.configure(disabled)
  if (rendererState.rpc !== originalRpc) await rendererState.rpc.dispose()
  rendererState.rpc = originalRpc
  jest.clearAllMocks()
})

test('disabled recording does not create a worker', async () => {
  await SessionReplay.configure(disabled)
  expect(createClient).not.toHaveBeenCalled()
  await expect(SessionReplay.getSession()).rejects.toThrow('disabled')
})

test('normal startup and the file picker do not mount a player', async () => {
  await expect(SessionReplay.initializeLayout('https://editor.test/')).resolves.toBe(false)
  await expect(SessionReplay.initializeLayout('https://editor.test/?sessionReplay=true')).resolves.toBe(true)
  expect(mountPlayer).not.toHaveBeenCalled()
  expect(createClient).not.toHaveBeenCalled()
})

test('opening a recorded session loads and mounts the player', async () => {
  await expect(SessionReplay.initializeLayout('https://editor.test/?replayId=saved-session')).resolves.toBe(true)
  expect(mountPlayer).toHaveBeenCalledWith(document.body, {
    source: { localId: 'saved-session' },
    workerUrl: expect.any(URL),
  })
})

test('legacy callers can enable local and upload recordings independently', async () => {
  for (const [local, upload] of [
    [true, false],
    [false, true],
  ]) {
    const options = { endpoint: 'https://backend.test/session-replay', local, upload }
    await SessionReplay.configure(options)
    expect(invoke).toHaveBeenCalledWith('start', options)
  }
})

test('disabling legacy recording disconnects its observer and terminates its worker', async () => {
  await SessionReplay.configure(enabled)
  await SessionReplay.configure(disabled)
  expect(stop).toHaveBeenCalledTimes(1)
  expect(dispose).toHaveBeenCalledTimes(1)
})

test('proxy recording captures one initial frame and transfers the renderer port without observing mutations', async () => {
  const port = createPort()
  await expect(SessionReplay.configureProxy(enabled, port)).resolves.toBe('session-id')
  expect(capture).toHaveBeenCalledTimes(1)
  expect(invoke).toHaveBeenCalledWith('start', enabled, frame)
  expect(invokeAndTransfer).toHaveBeenCalledWith('proxy', port)
  expect(createRpc).toHaveBeenCalledWith({ commandMap: {}, messagePort: proxyPort })
  expect(observe).not.toHaveBeenCalled()
  expect(rendererState.rpc).not.toBe(originalRpc)
})

test('stopping capture keeps live proxy traffic available until renderer disposal', async () => {
  await SessionReplay.configureProxy(enabled, createPort())
  const rpc = rendererState.rpc
  await SessionReplay.configure(disabled)
  expect(invoke).toHaveBeenCalledWith('stop')
  expect(rendererState.rpc).toBe(rpc)
  expect(dispose).not.toHaveBeenCalled()
  await expect(SessionReplay.getSession()).rejects.toThrow('disabled')
  await rpc.dispose()
  expect(dispose).toHaveBeenCalledTimes(1)
  expect(proxyDispose).toHaveBeenCalledTimes(1)
  expect(originalDispose).toHaveBeenCalledTimes(1)
  rendererState.rpc = originalRpc
})

test('proxy setup failure closes transferred ports and preserves the original renderer', async () => {
  const port = createPort()
  createRpc.mockRejectedValueOnce(new Error('connection failed'))
  await expect(SessionReplay.configureProxy(enabled, port)).rejects.toThrow('connection failed')
  expect(dispose).toHaveBeenCalledTimes(1)
  expect(proxyPort.close).toHaveBeenCalledTimes(1)
  expect(port.close).toHaveBeenCalledTimes(1)
  expect(rendererState.rpc).toBe(originalRpc)
})

test('an existing proxy requires a reload before another recording', async () => {
  await SessionReplay.configureProxy(enabled, createPort())
  await SessionReplay.configure(disabled)
  const port = createPort()
  await expect(SessionReplay.configureProxy(enabled, port)).rejects.toThrow('Reload the window')
  expect(port.close).toHaveBeenCalledTimes(1)
  expect(createClient).toHaveBeenCalledTimes(1)
})
