/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.restoreAllMocks()
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    send: jest.fn(() => {
      throw new Error('not implemented')
    }),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.ts')

const Location = await import('../src/parts/Location/Location.ts')

test('getPathName', () => {
  expect(Location.getPathName()).toBe('/')
})

test('setPathName', () => {
  const spy = jest.spyOn(history, 'pushState').mockImplementation(() => {})
  Location.setPathName('/test')
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(null, '', '/test')
})

test('setPathName - should do nothing when the resolved URL is unchanged', () => {
  history.replaceState(null, '', '/language-features-nvmrc/')
  const spy = jest.spyOn(history, 'pushState').mockImplementation(() => {})
  Location.setPathName('')
  expect(spy).not.toHaveBeenCalled()
})

test('setPathName - should do nothing if we are already at the url', () => {
  history.replaceState(null, '', '/test')
  const spy = jest.spyOn(history, 'pushState').mockImplementation(() => {})
  Location.setPathName('/test')
  expect(spy).not.toHaveBeenCalled()
})

test('setHash preserves the path and query while updating the fragment', () => {
  history.replaceState(null, '', '/static/index.html?test=1#old')
  const spy = jest.spyOn(history, 'replaceState')

  Location.setHash('#chat-task-1')

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(null, '', 'http://localhost/static/index.html?test=1#chat-task-1')
})

test('setHash clears the fragment and avoids redundant history writes', () => {
  history.replaceState(null, '', '/?test=1#chat-task-1')
  const spy = jest.spyOn(history, 'replaceState')

  Location.setHash('')
  Location.setHash('')

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(null, '', 'http://localhost/?test=1')
})

test('setWorkspaceUri preserves it in the current URL for reload', () => {
  history.replaceState(null, '', '/?test=1#state')
  const spy = jest.spyOn(history, 'replaceState')

  Location.setWorkspaceUri('remote-ssh://user@example.com/home')

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(null, '', 'http://localhost/?test=1&workspace=remote-ssh%3A%2F%2Fuser%40example.com%2Fhome#state')
})

test('hydrate keeps layout in sync with chat-route browser history', () => {
  jest.spyOn(RendererWorker, 'send').mockImplementation(() => {})
  history.replaceState(null, '', '/')
  Location.hydrate()
  history.replaceState(null, '', '/prefix/chat')
  window.dispatchEvent(new PopStateEvent('popstate'))
  expect(RendererWorker.send).toHaveBeenCalledWith('Layout.enterAiNativeLayout')
  history.replaceState(null, '', '/prefix/')
  window.dispatchEvent(new PopStateEvent('popstate'))
  expect(RendererWorker.send).toHaveBeenLastCalledWith('Layout.leaveSideBarFocusMode')
})

test.skip('getHref', () => {
  expect(Location.getHref()).toBe('/')
})
