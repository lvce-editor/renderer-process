import { afterEach, expect, jest, test } from '@jest/globals'
import * as WorkerRegistry from '../src/parts/WorkerRegistry/WorkerRegistry.ts'

afterEach(() => WorkerRegistry.terminateAll())

test('terminates named, anonymous and prelaunched workers exactly once', () => {
  const workers = Array.from({ length: 3 }, () => ({ terminate: jest.fn() }))
  for (const worker of workers) WorkerRegistry.track(worker)
  WorkerRegistry.track(workers[0])
  WorkerRegistry.terminateAll()
  WorkerRegistry.terminateAll()
  for (const worker of workers) expect(worker.terminate).toHaveBeenCalledTimes(1)
  expect(WorkerRegistry.getCount()).toBe(0)
})

test('a pending launch from the previous generation is terminated without entering the new registry', () => {
  const oldGeneration = WorkerRegistry.getGeneration()
  const stale = { terminate: jest.fn() }
  const replacement = { terminate: jest.fn() }
  WorkerRegistry.terminateAll()
  WorkerRegistry.track(replacement)
  expect(() => WorkerRegistry.track(stale, oldGeneration)).toThrow('canceled')
  expect(stale.terminate).toHaveBeenCalledTimes(1)
  expect(replacement.terminate).not.toHaveBeenCalled()
  expect(WorkerRegistry.getCount()).toBe(1)
})

test('a worker disposed individually is no longer retained by the registry', () => {
  const worker = { terminate: jest.fn() }
  WorkerRegistry.track(worker)
  WorkerRegistry.remove(worker)
  WorkerRegistry.terminateAll()
  expect(worker.terminate).not.toHaveBeenCalled()
})

test('worker metadata includes a unique runtime name and is removed on disposal', () => {
  const firstMetadata = WorkerRegistry.createRuntimeName('Renderer Worker')
  const secondMetadata = WorkerRegistry.createRuntimeName('Renderer Worker')
  const first = { name: firstMetadata.runtimeName, terminate: jest.fn() }
  const second = { name: secondMetadata.runtimeName, terminate: jest.fn() }
  WorkerRegistry.track(first, WorkerRegistry.getGeneration(), firstMetadata)
  WorkerRegistry.track(second, WorkerRegistry.getGeneration(), secondMetadata)
  expect(WorkerRegistry.getWorkers()).toEqual([firstMetadata, secondMetadata])
  WorkerRegistry.remove(first)
  expect(WorkerRegistry.getWorkers()).toEqual([secondMetadata])
})
