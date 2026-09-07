/** @jest-environment jsdom */
import { expect, jest, test } from '@jest/globals'

const getViewletInstance = jest.fn<() => any>()
jest.unstable_mockModule('@lvce-editor/virtual-dom', () => ({ getViewletInstance }))
const { focusBrowserAddress, queueBrowserAddressSelection, rememberBrowserParent, restoreBrowserParent } =
  await import('../src/parts/BrowserWorkspaceFocus/BrowserWorkspaceFocus.ts')

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
