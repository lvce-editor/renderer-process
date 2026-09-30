import { afterEach, expect, jest, test } from '@jest/globals'
import * as WorkerRegistry from '../src/parts/WorkerRegistry/WorkerRegistry.ts'

afterEach(() => WorkerRegistry.terminateAll())

test('pads single-digit runtime worker numbers without changing registry ids', () => {
  const workers = Array.from({ length: 110 }, () => WorkerRegistry.createRuntimeName('Worker'))
  for (const worker of workers) {
    const number = Number(worker.id.slice('worker-'.length))
    const paddedNumber = String(number).padStart(2, '0')
    expect(worker.runtimeName).toBe(`[worker-${paddedNumber}] ${worker.name}`)
    expect(worker.id).toBe(`worker-${number}`)
  }
  expect(workers.find(({ id }) => id === 'worker-9')?.runtimeName).toBe('[worker-09] Worker')
  expect(workers.find(({ id }) => id === 'worker-10')?.runtimeName).toBe('[worker-10] Worker')
  const workerOver99 = workers.find(({ id }) => Number(id.slice('worker-'.length)) > 99)
  expect(workerOver99?.runtimeName).toMatch(/^\[worker-\d{3,}\]/)
})

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

test('terminates a worker by stable id and ignores a stale id', () => {
  const worker = { terminate: jest.fn() }
  const metadata = WorkerRegistry.createRuntimeName('Disposable Worker')
  WorkerRegistry.track(worker, WorkerRegistry.getGeneration(), metadata)
  expect(WorkerRegistry.terminate(metadata.id)).toBe(true)
  expect(worker.terminate).toHaveBeenCalledTimes(1)
  expect(WorkerRegistry.terminate(metadata.id)).toBe(false)
})

test('keeps the worker hosting Workers view alive', () => {
  const worker = { terminate: jest.fn() }
  const metadata = WorkerRegistry.createRuntimeName('Workers View Worker')
  WorkerRegistry.track(worker, WorkerRegistry.getGeneration(), metadata)
  expect(WorkerRegistry.terminate(metadata.id)).toBe(false)
  expect(worker.terminate).not.toHaveBeenCalled()
  expect(WorkerRegistry.getWorkers()).toContainEqual(metadata)
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

test.each(['Electron', 'Web'])('keeps the %s platform suffix at the end of the runtime name', (platform) => {
  const name = `Terminal Worker (${platform})`
  const first = WorkerRegistry.createRuntimeName(name)
  const second = WorkerRegistry.createRuntimeName(name)
  expect(first.name).toBe(name)
  expect(first.runtimeName.endsWith(`(${platform})`)).toBe(true)
  expect(second.runtimeName.endsWith(`(${platform})`)).toBe(true)
  expect(first.runtimeName).toContain(first.id)
  expect(first.runtimeName).not.toBe(second.runtimeName)
})
