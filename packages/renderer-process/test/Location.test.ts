/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
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

test('setWorkspaceUri preserves it in the current URL for reload', () => {
  history.replaceState(null, '', '/?test=1#state')
  const spy = jest.spyOn(history, 'replaceState')

  Location.setWorkspaceUri('remote-ssh://user@example.com/home')

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(null, '', 'http://localhost/?test=1&workspace=remote-ssh%3A%2F%2Fuser%40example.com%2Fhome#state')
})

test.skip('hydrate', () => {
  // TODO mock instead
  // @ts-ignore
  RendererWorker.send.mockImplementation(() => {})
  Location.hydrate()
  window.dispatchEvent(new PopStateEvent('popstate'))
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Workspace.hydrate')
})

test.skip('getHref', () => {
  expect(Location.getHref()).toBe('/')
})
