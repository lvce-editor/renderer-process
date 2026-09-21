/** @jest-environment jsdom */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const invoke = jest.fn<(...args: any[]) => Promise<any>>()
const dispose = jest.fn<() => Promise<void>>()
const terminateAll = jest.fn()
const launchWorkers = jest.fn<() => Promise<any>>()
const disposeView = jest.fn()

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({ dispose, invoke }))
jest.unstable_mockModule('../src/parts/DragAndDropWorker/DragAndDropWorker.ts', () => ({ dispose: jest.fn() }))
jest.unstable_mockModule('../src/parts/SessionReplay/SessionReplay.ts', () => ({ dispose: jest.fn() }))
jest.unstable_mockModule('../src/parts/WorkerRegistry/WorkerRegistry.ts', () => ({ terminateAll }))
jest.unstable_mockModule('../src/parts/ModuleWorkerState/ModuleWorkerState.ts', () => ({ clear: jest.fn() }))
jest.unstable_mockModule('../src/parts/DirectViewRpcRegistry/DirectViewRpcRegistry.ts', () => ({ clear: jest.fn() }))
jest.unstable_mockModule('../src/parts/IpcStates/IpcStates.ts', () => ({ clear: jest.fn() }))
jest.unstable_mockModule('../src/parts/LaunchWorkers/LaunchWorkers.ts', () => ({ launchWorkers }))
jest.unstable_mockModule('../src/parts/Viewlet/Viewlet.ts', () => ({ dispose: disposeView }))

const HotReload = await import('../src/parts/HotReload/HotReload.ts')
const HotReloadState = await import('../src/parts/HotReloadState/HotReloadState.ts')
const snapshot = { id: 100, instances: { draft: { lines: ['unsaved'] } }, uids: [1, 2] }

beforeEach(() => {
  jest.clearAllMocks()
  jest.useFakeTimers()
  HotReloadState.set(undefined)
  localStorage.clear()
  document.body.replaceChildren()
  dispose.mockResolvedValue()
  launchWorkers.mockResolvedValue({ ok: true, value: undefined })
})

afterEach(() => {
  jest.useRealTimers()
})

test('retirement starts only after the snapshot reaches the surviving renderer and repeated requests coalesce', async () => {
  const ready = Promise.withResolvers<void>()
  const retiredSnapshots: unknown[] = []
  invoke.mockImplementation(async (method) => {
    switch (method) {
      case 'Reload.prepareHotReload':
        return snapshot
      case 'Reload.retire':
        retiredSnapshots.push(HotReloadState.get())
        return undefined
      case 'Reload.waitForReady':
        return ready.promise
      default:
        return undefined
    }
  })
  HotReload.request()
  HotReload.request()
  expect(terminateAll).not.toHaveBeenCalled()
  await jest.advanceTimersByTimeAsync(0)
  expect(retiredSnapshots).toEqual([snapshot])
  expect(terminateAll).toHaveBeenCalledTimes(1)
  expect(disposeView.mock.calls).toEqual([[2], [1]])
  expect(HotReload.getStatus().pending).toBe(true)
  HotReload.request()
  ready.resolve()
  await jest.advanceTimersByTimeAsync(0)
  expect(launchWorkers).toHaveBeenCalledTimes(1)
  expect(HotReloadState.get()).toBeUndefined()
  expect(HotReload.getStatus().pending).toBe(false)
  expect(document.documentElement.inert).toBe(false)
})

test('a failed snapshot leaves all workers alive', async () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {})
  invoke.mockRejectedValue(new Error('snapshot unavailable'))
  HotReload.request()
  await jest.advanceTimersByTimeAsync(0)
  expect(terminateAll).not.toHaveBeenCalled()
  expect(dispose).not.toHaveBeenCalled()
  expect(launchWorkers).not.toHaveBeenCalled()
  expect(HotReload.getStatus().error).toBe('snapshot unavailable')
  expect(document.documentElement.inert).toBe(false)
  log.mockRestore()
})

test('startup failure retains the snapshot and supplies ordinary reload recovery with saved drafts', async () => {
  const log = jest.spyOn(console, 'error').mockImplementation(() => {})
  invoke.mockImplementation(async (method) => (method === 'Reload.prepareHotReload' ? snapshot : undefined))
  launchWorkers.mockResolvedValue({ error: new Error('startup failed'), ok: false })
  HotReload.request()
  await jest.advanceTimersByTimeAsync(0)
  expect(HotReloadState.get()).toBe(snapshot)
  expect(JSON.parse(localStorage.getItem('draft')!)).toEqual({ lines: ['unsaved'] })
  expect(document.querySelector('button')?.textContent).toContain('Reload window')
  expect(HotReload.getStatus().pending).toBe(false)
  log.mockRestore()
})
