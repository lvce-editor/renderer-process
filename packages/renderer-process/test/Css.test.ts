/**
 * @jest-environment jsdom
 */
import { beforeEach, beforeAll, expect, jest, test } from '@jest/globals'

beforeAll(() => {
  // @ts-ignore
  globalThis.CSSStyleSheet = class {
    constructor() {}

    replace(_content) {}
    replaceSync(_content) {}
  }
})

beforeEach(() => {
  document.head.replaceChildren()
  document.adoptedStyleSheets = []
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/CssState/CssState.ts', () => ({
  get: jest.fn(() => {
    throw new Error('not implemented')
  }),
  set: jest.fn(() => {
    throw new Error(`not implemented`)
  }),
  getText: jest.fn(() => {
    throw new Error('not implemented')
  }),
  remove: jest.fn(() => {
    throw new Error('not implemented')
  }),
  setText: jest.fn(() => {
    throw new Error('not implemented')
  }),
}))

const Css = await import('../src/parts/Css/Css.ts')
const CssState = await import('../src/parts/CssState/CssState.ts')

test('addCssStyleSheet - add', async () => {
  const id = '1'
  const text = '* { font-size: 14px; }'
  // @ts-ignore
  CssState.get.mockImplementation(() => {
    return undefined
  })
  // @ts-ignore
  CssState.set.mockImplementation(() => {})
  // @ts-ignore
  CssState.setText.mockImplementation(() => {})
  Css.addCssStyleSheet(id, text)
  expect(document.adoptedStyleSheets).toHaveLength(1)
  expect(CssState.setText).toHaveBeenCalledWith(id, text)
})

test('addCssStyleSheet - replace', async () => {
  const id = '1'
  const text = '* { font-size: 14px; }'
  const existing = new CSSStyleSheet()
  document.adoptedStyleSheets.push(existing)
  // @ts-ignore
  CssState.get.mockImplementation(() => {
    return existing
  })
  // @ts-ignore
  CssState.setText.mockImplementation(() => {})
  Css.addCssStyleSheet(id, text)
  expect(document.adoptedStyleSheets).toHaveLength(1)
  expect(document.adoptedStyleSheets[0]).toBe(existing)
  expect(CssState.setText).toHaveBeenCalledWith(id, text)
})

test('patchCssStyleSheet - replace', () => {
  const id = '1'
  const existing = new CSSStyleSheet()
  existing.replaceSync = jest.fn()
  // @ts-ignore
  CssState.get.mockReturnValue(existing)
  // @ts-ignore
  CssState.getText.mockReturnValue('color: red')
  // @ts-ignore
  CssState.setText.mockImplementation(() => {})

  Css.patchCssStyleSheet(id, 7, 3, 'blue')

  expect(existing.replaceSync).toHaveBeenCalledWith('color: blue')
  expect(CssState.setText).toHaveBeenCalledWith(id, 'color: blue')
})

test('patchCssStyleSheet - insert', () => {
  const id = '1'
  const existing = new CSSStyleSheet()
  existing.replaceSync = jest.fn()
  // @ts-ignore
  CssState.get.mockReturnValue(existing)
  // @ts-ignore
  CssState.getText.mockReturnValue('ab')
  // @ts-ignore
  CssState.setText.mockImplementation(() => {})

  Css.patchCssStyleSheet(id, 1, 0, 'c')

  expect(existing.replaceSync).toHaveBeenCalledWith('acb')
})

test('patchCssStyleSheet - delete', () => {
  const id = '1'
  const existing = new CSSStyleSheet()
  existing.replaceSync = jest.fn()
  // @ts-ignore
  CssState.get.mockReturnValue(existing)
  // @ts-ignore
  CssState.getText.mockReturnValue('abc')
  // @ts-ignore
  CssState.setText.mockImplementation(() => {})

  Css.patchCssStyleSheet(id, 1, 1, '')

  expect(existing.replaceSync).toHaveBeenCalledWith('ac')
})

test('patchCssStyleSheet - rejects missing base stylesheet', () => {
  // @ts-ignore
  CssState.get.mockReturnValue(undefined)
  // @ts-ignore
  CssState.getText.mockReturnValue(undefined)

  expect(() => Css.patchCssStyleSheet('missing', 0, 0, 'a')).toThrow('stylesheet missing must be initialized before it can be patched')
})

test('patchCssStyleSheet - rejects invalid ranges', () => {
  const existing = new CSSStyleSheet()
  // @ts-ignore
  CssState.get.mockReturnValue(existing)
  // @ts-ignore
  CssState.getText.mockReturnValue('abc')

  expect(() => Css.patchCssStyleSheet('1', -1, 0, '')).toThrow('start must be an integer within the stylesheet')
  expect(() => Css.patchCssStyleSheet('1', 1, 3, '')).toThrow('deleteCount must be an integer within the stylesheet')
})

test('removeCssStyleSheet', () => {
  const existing = new CSSStyleSheet()
  const other = new CSSStyleSheet()
  document.adoptedStyleSheets = [existing, other]
  // @ts-ignore
  CssState.get.mockReturnValue(existing)
  // @ts-ignore
  CssState.remove.mockImplementation(() => {})

  Css.removeCssStyleSheet('1')

  expect(document.adoptedStyleSheets).toEqual([other])
  expect(CssState.remove).toHaveBeenCalledWith('1')
})
