/** @jest-environment jsdom */
import { beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: readonly unknown[]) => Promise<string>>().mockResolvedValue('session-id')
const dispose = jest.fn()
const stop = jest.fn()
const observe = jest.fn(() => stop)
const createClient = jest.fn(() => ({ dispose, invoke }))
jest.unstable_mockModule('@lvce-editor/session-replay-worker/client', () => ({ createClient }))
jest.unstable_mockModule('@lvce-editor/session-replay-worker/capture', () => ({ observe, serializeMessage: (value: unknown) => value }))
jest.unstable_mockModule('@lvce-editor/session-replay-worker/player', () => ({ mountPlayer: jest.fn() }))
const SessionReplay = await import('../src/parts/SessionReplay/SessionReplay.ts')

beforeEach(async () => {
  await SessionReplay.configure({ endpoint: '', local: false, upload: false })
  jest.clearAllMocks()
})

test('disabled recording does not create a worker', async () => {
  await SessionReplay.configure({ endpoint: '', local: false, upload: false })
  expect(createClient).not.toHaveBeenCalled()
})

test('local and upload recording can each be enabled independently', async () => {
  for (const [local, upload] of [
    [true, false],
    [false, true],
  ]) {
    await SessionReplay.configure({ endpoint: 'https://backend.test/session-replay', local, upload })
    expect(invoke).toHaveBeenCalledWith('start', { endpoint: 'https://backend.test/session-replay', local, upload })
  }
})

test('transport observation preserves messages and transfer lists and attaches only once', async () => {
  await SessionReplay.configure({ endpoint: '', local: true, upload: false })
  const sendAndTransfer = jest.fn()
  const ipc = Object.assign(new EventTarget(), { getData: (event: MessageEvent) => event.data, sendAndTransfer })
  SessionReplay.attach({ ipc })
  SessionReplay.attach({ ipc })
  const message = { method: 'Viewlet.setDom', params: [1, []] }
  const transfers = [new ArrayBuffer(8)]
  ipc.sendAndTransfer(message, transfers)
  expect(sendAndTransfer).toHaveBeenCalledTimes(1)
  expect(sendAndTransfer).toHaveBeenCalledWith(message, transfers)
  ipc.dispatchEvent(new MessageEvent('message', { data: message }))
  expect(invoke).toHaveBeenCalledWith('record', 'message', { direction: 'sent', message })
  expect(invoke).toHaveBeenCalledWith('record', 'message', { direction: 'received', message })
})

test('disabling recording disconnects the observer and terminates the worker', async () => {
  await SessionReplay.configure({ endpoint: '', local: true, upload: false })
  await SessionReplay.configure({ endpoint: '', local: false, upload: false })
  expect(stop).toHaveBeenCalledTimes(1)
  expect(dispose).toHaveBeenCalledTimes(1)
})
