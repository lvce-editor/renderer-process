import { afterEach, expect, jest, test } from '@jest/globals'
import { measurePrefix } from '../src/parts/MeasureBidi/MeasureBidi.ts'

const originalDocument = globalThis.document

afterEach(() => {
  globalThis.document = originalDocument
})

test('measures within the full shaping context and removes the temporary element', () => {
  const element = { firstChild: {}, remove: jest.fn(), style: {} as Record<string, string>, textContent: '' }
  const setEnd = jest.fn()
  const append = jest.fn()
  globalThis.document = {
    body: { append },
    createElement: () => element,
    createRange: () => ({ getBoundingClientRect: () => ({ width: 12.5 }), setEnd, setStart: jest.fn() }),
  } as unknown as Document

  expect(measurePrefix('مرحبا', 2, 400, 18, 'Fira Code', 0.5, 'rtl')).toBe(12.5)
  expect(element.textContent).toBe('مرحبا')
  expect(element.style).toMatchObject({ direction: 'rtl', letterSpacing: '0.5px', unicodeBidi: 'bidi-override', whiteSpace: 'pre' })
  expect(setEnd).toHaveBeenCalledWith(element.firstChild, 2)
  expect(append).toHaveBeenCalledWith(element)
  expect(element.remove).toHaveBeenCalledTimes(1)
  measurePrefix('مرحبا', 99, 400, 18, 'Fira Code', 0.5, 'rtl')
  expect(setEnd).toHaveBeenLastCalledWith(element.firstChild, 5)
})

test('measurement failures clean up the temporary element', () => {
  const remove = jest.fn()
  globalThis.document = {
    body: { append: jest.fn() },
    createElement: () => ({ firstChild: {}, remove, style: {}, textContent: '' }),
    createRange: () => {
      throw new Error('Range failed')
    },
  } as unknown as Document
  expect(() => measurePrefix('مرحبا', 1, 400, 18, 'Fira Code', 0, 'rtl')).toThrow('Range failed')
  expect(remove).toHaveBeenCalledTimes(1)
})
