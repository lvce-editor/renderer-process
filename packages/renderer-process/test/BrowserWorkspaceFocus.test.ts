/** @jest-environment jsdom */
import { beforeAll, expect, jest, test } from '@jest/globals'

const getViewletInstance = jest.fn<() => any>()
jest.unstable_mockModule('@lvce-editor/virtual-dom', () => ({ getViewletInstance }))
const { focusBrowserAddress, listen, queueBrowserAddressSelection, rememberBrowserParent, restoreBrowserParent } =
  await import('../src/parts/BrowserWorkspaceFocus/BrowserWorkspaceFocus.ts')

beforeAll(() => listen())

test('restores the same browser node between its original siblings', () => {
  const group = document.createElement('div')
  const before = document.createElement('span')
  const browser = document.createElement('div')
  const after = document.createElement('span')
  group.append(before, browser, after)
  document.body.replaceChildren(group)
  getViewletInstance.mockReturnValue({ state: { $Viewlet: browser } })
  rememberBrowserParent(1)
  rememberBrowserParent(1)
  document.body.append(browser)
  restoreBrowserParent(1)
  expect([...group.childNodes]).toEqual([before, browser, after])
  restoreBrowserParent(1)
  expect([...group.childNodes]).toEqual([before, browser, after])
})

test('removes the marker if the browser was disposed', () => {
  const browser = document.createElement('div')
  document.body.replaceChildren(browser)
  getViewletInstance.mockReturnValue({ state: { $Viewlet: browser } })
  rememberBrowserParent(2)
  browser.remove()
  getViewletInstance.mockReturnValue(undefined)
  restoreBrowserParent(2)
  expect(document.body.childNodes).toHaveLength(0)
})

test('restoring an address selection cancels delayed select-all from focus', () => {
  jest.useFakeTimers()
  const browser = document.createElement('div')
  const address = document.createElement('input')
  address.name = 'simple-browser-address'
  address.value = 'https://example.com'
  browser.append(address)
  document.body.replaceChildren(browser)
  getViewletInstance.mockReturnValue({ state: { $Viewlet: browser } })
  address.addEventListener('focus', () => queueBrowserAddressSelection(address))
  focusBrowserAddress(1, { end: 8, start: 2 })
  jest.runAllTimers()
  expect(document.activeElement).toBe(address)
  expect([address.selectionStart, address.selectionEnd]).toEqual([2, 8])
  jest.useRealTimers()
})

test('clears address selection on native blur even with worker-owned event listeners', async () => {
  jest.useFakeTimers()
  const address = document.createElement('input')
  address.name = 'simple-browser-address'
  address.value = 'https://example.com'
  document.body.replaceChildren(address)
  address.focus()
  address.select()
  // Native WebContents focus leaves activeElement pointing at the address.
  const hasFocus = jest.spyOn(document, 'hasFocus').mockReturnValue(false)
  address.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
  jest.runAllTimers()
  expect([address.selectionStart, address.selectionEnd]).toEqual([0, 0])
  hasFocus.mockRestore()
  jest.useRealTimers()
})

test('preserves newer address focus when a deferred blur is processed', async () => {
  jest.useFakeTimers()
  const address = document.createElement('input')
  address.name = 'simple-browser-address'
  address.value = 'https://example.com'
  document.body.replaceChildren(address)
  address.focus()
  address.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: null }))
  address.setSelectionRange(2, 8)
  const hasFocus = jest.spyOn(document, 'hasFocus').mockReturnValue(true)
  jest.runAllTimers()
  expect([address.selectionStart, address.selectionEnd]).toEqual([2, 8])
  hasFocus.mockRestore()
  jest.useRealTimers()
})

test('delayed focus selection preserves text typed before its timer runs', () => {
  jest.useFakeTimers()
  const address = document.createElement('input')
  address.name = 'simple-browser-address'
  address.value = 'https://example.com'
  document.body.replaceChildren(address)
  address.focus()
  queueBrowserAddressSelection(address)
  address.value = 'h'
  address.setSelectionRange(1, 1)
  address.dispatchEvent(new Event('input', { bubbles: true }))
  jest.runAllTimers()
  expect(address.value).toBe('h')
  expect([address.selectionStart, address.selectionEnd]).toEqual([1, 1])
  jest.useRealTimers()
})

test('delayed focus selection preserves a newer keyboard caret move', () => {
  jest.useFakeTimers()
  const address = document.createElement('input')
  address.name = 'simple-browser-address'
  address.value = 'https://example.com'
  document.body.replaceChildren(address)
  address.focus()
  queueBrowserAddressSelection(address)
  address.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft', bubbles: true }))
  address.setSelectionRange(3, 3)
  jest.runAllTimers()
  expect([address.selectionStart, address.selectionEnd]).toEqual([3, 3])
  jest.useRealTimers()
})
