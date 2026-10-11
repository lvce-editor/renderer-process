import { afterEach, expect, jest, test } from '@jest/globals'
import { createCanvasPresentation } from '../src/parts/CreateCanvasPresentation/CreateCanvasPresentation.ts'

afterEach(() => {
  jest.restoreAllMocks()
})

const setup = () => {
  const port1 = { close: jest.fn(), onmessage: null as any, onmessageerror: null as any, postMessage: jest.fn() }
  const port2 = { close: jest.fn() }
  jest.spyOn(globalThis, 'MessageChannel').mockImplementation(() => ({ port1, port2 }) as unknown as MessageChannel)
  const context = { transferFromImageBitmap: jest.fn() }
  const canvas = { getContext: jest.fn(() => context) }
  const onDispose = jest.fn()
  const presentation = createCanvasPresentation(canvas as unknown as HTMLCanvasElement, onDispose)
  return { context, onDispose, port: presentation.port, port1, port2, presentation }
}

test('presents and acknowledges each transferred frame and releases its bitmap', () => {
  const { context, port, port1, port2 } = setup()
  expect(port).toBe(port2)
  const bitmap = { close: jest.fn() }
  port1.onmessage({ data: { bitmap, type: 'frame' } })
  expect(context.transferFromImageBitmap).toHaveBeenCalledWith(bitmap)
  expect(bitmap.close).toHaveBeenCalledTimes(1)
  expect(port1.postMessage).toHaveBeenCalledWith({ type: 'presented' })
})

test('disposal releases the registered canvas and detaches the presentation handler', () => {
  const { onDispose, port1 } = setup()
  port1.onmessage({ data: { type: 'dispose' } })
  expect(port1.close).toHaveBeenCalledTimes(1)
  expect(port1.onmessage).toBeNull()
  expect(port1.onmessageerror).toBeNull()
  expect(onDispose).toHaveBeenCalledTimes(1)
})

test('a rejected bitmap releases the frame slot and subsequent valid frames still present', () => {
  const { context, port1 } = setup()
  port1.onmessageerror({})
  expect(port1.postMessage).toHaveBeenCalledWith({ type: 'presented' })
  expect(context.transferFromImageBitmap).not.toHaveBeenCalled()
  const bitmap = { close: jest.fn() }
  port1.onmessage({ data: { bitmap, type: 'frame' } })
  expect(context.transferFromImageBitmap).toHaveBeenCalledWith(bitmap)
  expect(bitmap.close).toHaveBeenCalledTimes(1)
  expect(port1.postMessage).toHaveBeenCalledTimes(2)
})

test('a queued decoding error after disposal does not acknowledge on the closed port', () => {
  const { port1, presentation } = setup()
  const onError = port1.onmessageerror
  presentation.dispose()
  onError({})
  expect(port1.postMessage).not.toHaveBeenCalled()
})
