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
  getText: jest.fn(() => {
    throw new Error('not implemented')
  }),
  remove: jest.fn(() => {
    throw new Error('not implemented')
  }),
  set: jest.fn(() => {
    throw new Error(`not implemented`)
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

test('addCssStyleSheet - notifies mounted terminals when the contributed theme changes', () => {
  const listener = jest.fn()
  window.addEventListener('color-theme-changed', listener)
  // @ts-ignore
  CssState.get.mockImplementation(() => undefined)
  // @ts-ignore
  CssState.set.mockImplementation(() => {})
  // @ts-ignore
  CssState.setText.mockImplementation(() => {})

  Css.addCssStyleSheet('ContributedColorTheme', ':root { --TerminalForeground: #123456; }')

  expect(listener).toHaveBeenCalledTimes(1)
  window.removeEventListener('color-theme-changed', listener)
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

test('identical stylesheet text skips CSSOM replacement but retains theme notifications', () => {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync = jest.fn()
  jest.mocked(CssState.get).mockReturnValue(sheet)
  jest.mocked(CssState.getText).mockReturnValue(':root { color: red; }')
  const listener = jest.fn()
  window.addEventListener('color-theme-changed', listener)
  try {
    Css.addCssStyleSheet('EditorGroup', ':root { color: red; }')
    Css.addCssStyleSheet('ContributedColorTheme', ':root { color: red; }')
    expect(sheet.replaceSync).not.toHaveBeenCalled()
    expect(CssState.setText).not.toHaveBeenCalled()
    expect(listener).toHaveBeenCalledTimes(1)
  } finally {
    window.removeEventListener('color-theme-changed', listener)
  }
})

test('failed initial replacement does not publish a stylesheet or its text', () => {
  jest.mocked(CssState.get).mockReturnValue(undefined)
  const replace = jest.spyOn(CSSStyleSheet.prototype, 'replaceSync').mockImplementation(() => {
    throw new Error('replacement failed')
  })
  try {
    expect(() => Css.addCssStyleSheet('EditorGroup', 'a {}')).toThrow('replacement failed')
    expect(CssState.set).not.toHaveBeenCalled()
    expect(CssState.setText).not.toHaveBeenCalled()
    expect(document.adoptedStyleSheets).toHaveLength(0)
  } finally {
    replace.mockRestore()
  }
})

test('failed update keeps the applied text and retries the same requested text', () => {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync = jest.fn().mockImplementationOnce(() => {
    throw new Error('replacement failed')
  })
  let applied = 'old {}'
  jest.mocked(CssState.get).mockReturnValue(sheet)
  jest.mocked(CssState.getText).mockImplementation(() => applied as never)
  jest.mocked(CssState.setText).mockImplementation((_id, text) => {
    applied = text
  })
  expect(() => Css.addCssStyleSheet('EditorGroup', 'new {}')).toThrow('replacement failed')
  expect(applied).toBe('old {}')
  Css.addCssStyleSheet('EditorGroup', 'new {}')
  Css.addCssStyleSheet('EditorGroup', 'new {}')
  expect(sheet.replaceSync).toHaveBeenCalledTimes(2)
  expect(applied).toBe('new {}')
})

test('patch and removal invalidate the identity of the last applied text', () => {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync = jest.fn()
  let applied = 'a {}'
  let current: CSSStyleSheet | undefined = sheet
  jest.mocked(CssState.get).mockImplementation(() => current)
  jest.mocked(CssState.getText).mockImplementation(() => applied as never)
  jest.mocked(CssState.setText).mockImplementation((_id, text) => {
    applied = text
  })
  jest.mocked(CssState.remove).mockImplementation(() => {
    current = undefined
  })
  jest.mocked(CssState.set).mockImplementation((_id, next) => {
    current = next
  })
  document.adoptedStyleSheets = [sheet]
  Css.patchCssStyleSheet('EditorGroup', 0, 1, 'b')
  Css.addCssStyleSheet('EditorGroup', 'b {}')
  expect(sheet.replaceSync).toHaveBeenCalledTimes(1)
  Css.addCssStyleSheet('EditorGroup', 'a {}')
  expect(sheet.replaceSync).toHaveBeenCalledTimes(2)
  Css.removeCssStyleSheet('EditorGroup')
  Css.addCssStyleSheet('EditorGroup', 'a {}')
  expect(current).not.toBe(sheet)
  expect(document.adoptedStyleSheets).toHaveLength(1)
})

test('unknown text does not match an uninitialized cache entry', () => {
  const sheet = new CSSStyleSheet()
  sheet.replaceSync = jest.fn()
  jest.mocked(CssState.get).mockReturnValue(sheet)
  jest.mocked(CssState.getText).mockReturnValue(undefined)
  Css.addCssStyleSheet('EditorGroup', undefined)
  expect(jest.mocked(sheet.replaceSync).mock.calls).toEqual([[undefined]])
})
