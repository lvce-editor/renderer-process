/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/IpcParentWithMessagePort/IpcParentWithMessagePort.ts', () => {
  return {
    create: jest.fn(() => {
      return {}
    }),
  }
})

jest.unstable_mockModule('https://example.com/worker.ts', () => {}, {
  virtual: true,
})

jest.unstable_mockModule('https://example.com/not-found.ts', () => {}, {
  virtual: true,
})

const IpcParentWithMessagePort = await import('../src/parts/IpcParentWithMessagePort/IpcParentWithMessagePort.ts')
const IpcParentWithModuleWorker = await import('../src/parts/IpcParentWithModuleWorker/IpcParentWithModuleWorker.ts')

test('create - error - not found', async () => {
  // @ts-ignore
  globalThis.Worker = class extends EventTarget {
    constructor() {
      super()
      setTimeout(() => {
        const errorEvent = new Event('error', {})
        this.dispatchEvent(errorEvent)
      }, 0)
    }
  }
  // @ts-ignore
  IpcParentWithMessagePort.create.mockImplementation(() => {
    return {}
  })
  await expect(
    IpcParentWithModuleWorker.create({
      url: 'https://example.com/not-found.ts',
      name: 'Renderer Worker',
    }),
  ).rejects.toThrow(new Error('Failed to start Renderer Worker'))
})

test('create', async () => {
  // @ts-ignore
  globalThis.Worker = class extends EventTarget {
    constructor() {
      super()
      setTimeout(() => {
        const dataEvent = new MessageEvent('message', {
          data: 'ready',
        })
        this.dispatchEvent(dataEvent)
      }, 0)
    }
  }

  expect(
    await IpcParentWithModuleWorker.create({
      url: 'https://example.com/not-found.ts',
      name: 'Renderer Worker',
    }),
  ).toEqual(new globalThis.Worker(''))
})
