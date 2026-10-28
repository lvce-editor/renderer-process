/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import type { Rpc } from '@lvce-editor/rpc'

const rendererWorkerSend = jest.fn()
const rendererWorkerInvoke = jest.fn<(method: string, ...params: readonly any[]) => Promise<void>>().mockResolvedValue(undefined)

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({
  invoke: rendererWorkerInvoke,
  send: rendererWorkerSend,
}))

const ComponentUid = await import('../src/parts/ComponentUid/ComponentUid.ts')
const EditorEventQueue = await import('../src/parts/EditorEventQueue/EditorEventQueue.ts')
const DirectViewRpcRegistry = await import('../src/parts/DirectViewRpcRegistry/DirectViewRpcRegistry.ts')
const ScrollSpeed = await import('../src/parts/ScrollSpeed/ScrollSpeed.ts')
const ViewletEventRouter = await import('../src/parts/ViewletEventRouter/ViewletEventRouter.ts')

const createRpc = (): Rpc =>
  ({
    dispose: jest.fn(),
    invoke: jest.fn<(method: string, ...params: readonly any[]) => Promise<void>>().mockResolvedValue(undefined),
    send: jest.fn(),
  }) as unknown as Rpc

beforeEach(async () => {
  await EditorEventQueue.runShortcut(async () => {})
  document.body.replaceChildren()
  rendererWorkerInvoke.mockClear()
  ScrollSpeed.dispose(42)
  DirectViewRpcRegistry.clear()
  rendererWorkerSend.mockClear()
})

test('routes a viewlet event directly to its worker', () => {
  const rpc = createRpc()
  DirectViewRpcRegistry.registerRpc('Panel', rpc)
  DirectViewRpcRegistry.registerView(42, 'Panel')

  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleClick', 3)

  expect(rpc.send).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleClick', 3)
  expect(rendererWorkerSend).not.toHaveBeenCalled()
})

test('routes an event without a direct worker to the renderer worker', () => {
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleClick', 3)

  expect(rendererWorkerSend).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleClick', 3)
})

test('routes other renderer messages to the renderer worker', () => {
  const rpc = createRpc()
  DirectViewRpcRegistry.registerRpc('Panel', rpc)
  DirectViewRpcRegistry.registerView(42, 'Panel')

  ViewletEventRouter.send('Other.command', 42, 'value')

  expect(rendererWorkerSend).toHaveBeenCalledWith('Other.command', 42, 'value')
  expect(rpc.send).not.toHaveBeenCalled()
})

test('routes native editor input directly without waiting for earlier input renders', async () => {
  const rpc = createRpc()
  const first = Promise.withResolvers<void>()
  const invoke = jest.mocked(rpc.invoke)
  invoke.mockReturnValueOnce(first.promise)
  DirectViewRpcRegistry.registerRpc('Editor', rpc)
  DirectViewRpcRegistry.registerView(42, 'Editor')

  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleBeforeInput', 'insertText', 'a')
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleBeforeInput', 'insertText', 'b')

  expect(invoke).toHaveBeenCalledTimes(2)
  expect(rendererWorkerSend).not.toHaveBeenCalled()
  first.resolve()
  await first.promise
})

test('keeps editor blur on its focus-preserving direct handler', () => {
  const rpc = createRpc()
  DirectViewRpcRegistry.registerRpc('Editor', rpc)
  DirectViewRpcRegistry.registerView(42, 'Editor')

  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleBlur')

  expect(rpc.send).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleBlur')
  expect(rendererWorkerSend).not.toHaveBeenCalled()
})

test('keyboard dispatch holds native input until the shortcut completes', async () => {
  const rpc = createRpc()
  const done = Promise.withResolvers<void>()
  rendererWorkerInvoke.mockReturnValueOnce(done.promise)
  DirectViewRpcRegistry.registerRpc('Editor', rpc)
  DirectViewRpcRegistry.registerView(42, 'Editor')
  const input = document.createElement('textarea')
  ComponentUid.set(input, 42)
  document.body.append(input)
  input.focus()

  ViewletEventRouter.sendKeyBinding(2049)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleBeforeInput', 'insertText', 'replacement')
  // Blur must be delivered while a shortcut is still moving focus.
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleBlur')
  expect(rpc.send).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleBlur')
  expect(rpc.invoke).not.toHaveBeenCalled()
  await Promise.resolve()
  expect(rendererWorkerInvoke).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', 2049, 42)
  done.resolve()
  await EditorEventQueue.runShortcut(async () => {})
  expect(rpc.invoke).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleBeforeInput', 'insertText', 'replacement')
})

test('drops delayed native input when its editor was closed by the shortcut', async () => {
  const rpc = createRpc()
  DirectViewRpcRegistry.registerRpc('Editor', rpc)
  DirectViewRpcRegistry.registerView(42, 'Editor')
  const shortcut = EditorEventQueue.runShortcut(async () => {
    DirectViewRpcRegistry.unregisterView(42)
  })
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleBeforeInput', 'insertText', 'stale')
  await shortcut
  await EditorEventQueue.runShortcut(async () => {})
  expect(rpc.invoke).not.toHaveBeenCalled()
})

test('keeps a queued shortcut on its original editor when focus changes during input', async () => {
  const rpc = createRpc()
  const inputFinished = Promise.withResolvers<void>()
  jest.mocked(rpc.invoke).mockReturnValueOnce(inputFinished.promise)
  DirectViewRpcRegistry.registerRpc('Editor', rpc)
  for (const uid of [42, 43]) {
    DirectViewRpcRegistry.registerView(uid, 'Editor')
    const input = document.createElement('textarea')
    ComponentUid.set(input, uid)
    document.body.append(input)
  }
  const [source, preview] = document.querySelectorAll('textarea')
  source.focus()
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleBeforeInput', 'insertText', 'replacement')
  ViewletEventRouter.sendKeyBinding(2049)
  preview.focus()
  inputFinished.resolve()
  await EditorEventQueue.runShortcut(async () => {})

  expect(rendererWorkerInvoke).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', 2049, 42)
})

test.each([1, 1.5, 3, 10])('scales both wheel axes once at speed %s on either route', async (speed) => {
  const listeners = [{ params: ['handleWheel', 'event.deltaMode', 'event.deltaX', 'event.deltaY'] }]
  ScrollSpeed.register(42, listeners, speed)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, -10, 20)
  expect(rendererWorkerSend).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, -10 * speed, 20 * speed)
  const rpc = createRpc()
  DirectViewRpcRegistry.registerRpc('Editor', rpc)
  DirectViewRpcRegistry.registerView(42, 'Editor')
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, -10, 20)
  await EditorEventQueue.runShortcut(async () => {})
  expect(rpc.invoke).toHaveBeenCalledWith('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, -10 * speed, 20 * speed)
})

test('updates existing views without scaling scrollbar coordinates or unrelated commands', () => {
  ScrollSpeed.register(42, [{ params: ['handleWheel', 'event.deltaMode', 'event.deltaY'] }], 1)
  ScrollSpeed.set(42, 3)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleWheel', 1, -20)
  expect(rendererWorkerSend).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 42, 'handleWheel', 1, -60)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleScrollBarMove', 20)
  expect(rendererWorkerSend).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 42, 'handleScrollBarMove', 20)
  ViewletEventRouter.send('Other.command', 42, 'handleWheel', 1, 20)
  expect(rendererWorkerSend).toHaveBeenLastCalledWith('Other.command', 42, 'handleWheel', 1, 20)
  ScrollSpeed.dispose(42)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleWheel', 1, 20)
  expect(rendererWorkerSend).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 42, 'handleWheel', 1, 20)
})

test.each([undefined, null, '3', 0, -1, 10.1, NaN, Infinity])('invalid speed %s falls back to baseline', (speed) => {
  ScrollSpeed.register(42, [{ params: ['handleWheel', 'event.deltaMode', 'event.deltaY'] }], speed)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, 20)
  expect(rendererWorkerSend).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, 20)
  ScrollSpeed.set(42, 3)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, 20)
  expect(rendererWorkerSend).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, 60)
  ScrollSpeed.set(42, speed)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, 20)
  expect(rendererWorkerSend).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, 20)
})

test('isolates view settings and removes stale metadata when listeners are replaced', () => {
  ScrollSpeed.register(42, [{ params: ['handleWheel', 'event.deltaMode', 'event.deltaY'] }], 3)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 43, 'handleWheel', 0, 20)
  expect(rendererWorkerSend).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 43, 'handleWheel', 0, 20)
  ScrollSpeed.register(42, [{ params: ['handleClick', 'event.clientY'] }])
  ScrollSpeed.set(42, 3)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, 20)
  expect(rendererWorkerSend).toHaveBeenLastCalledWith('Viewlet.executeViewletCommand', 42, 'handleWheel', 0, 20)
})
