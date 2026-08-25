/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.useRealTimers()
  jest.clearAllMocks()
  document.body.replaceChildren()
})

jest.unstable_mockModule('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserFunctions.ts', () => ({
  acceptSuggestion: jest.fn(),
  backward: jest.fn(),
  cancelNavigation: jest.fn(),
  closeSuggestions: jest.fn(),
  forward: jest.fn(),
  handleInput: jest.fn(),
  openExternal: jest.fn(),
  reload: jest.fn(),
}))

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({
  send: jest.fn(),
}))

const ViewletSimpleBrowserEvents = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserEvents.ts')
const ViewletSimpleBrowserFunctions = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserFunctions.ts')

const handleBlur = (event: any) => {
  jest.useFakeTimers()
  ViewletSimpleBrowserEvents.handleBlur(event)
  jest.runAllTimers()
}

test('focusing the address input selects its value', () => {
  jest.useFakeTimers()
  const target = document.createElement('input')
  target.value = 'https://example.com'
  document.body.append(target)

  ViewletSimpleBrowserEvents.handleFocus({ target })
  jest.runAllTimers()

  expect(target.selectionStart).toBe(0)
  expect(target.selectionEnd).toBe(target.value.length)
  jest.useRealTimers()
})

test('restoring focus with suggestions visible places the caret after the query', () => {
  jest.useFakeTimers()
  const simpleBrowser = document.createElement('div')
  simpleBrowser.className = 'SimpleBrowser'
  const target = document.createElement('input')
  target.value = 'what'
  const suggestions = document.createElement('div')
  suggestions.className = 'SimpleBrowserSuggestions'
  simpleBrowser.append(target, suggestions)
  document.body.append(simpleBrowser)

  ViewletSimpleBrowserEvents.handleFocus({ target })
  jest.runAllTimers()

  expect(target.selectionStart).toBe(target.value.length)
  expect(target.selectionEnd).toBe(target.value.length)
  jest.useRealTimers()
})

test('clicking a search suggestion accepts it', () => {
  const suggestion = document.createElement('button')
  suggestion.className = 'SimpleBrowserSuggestion'
  suggestion.dataset.value = 'what is lvce editor'
  const label = document.createElement('span')
  suggestion.append(label)

  ViewletSimpleBrowserEvents.handleClickSuggestion({ target: label })

  expect(ViewletSimpleBrowserFunctions.acceptSuggestion).toHaveBeenCalledWith('what is lvce editor')
})

test('clicking outside a search suggestion does nothing', () => {
  const target = document.createElement('div')

  ViewletSimpleBrowserEvents.handleClickSuggestion({ target })

  expect(ViewletSimpleBrowserFunctions.acceptSuggestion).not.toHaveBeenCalled()
})

test('moving focus outside the suggestions closes them', () => {
  const target = document.createElement('input')
  document.body.append(target)
  target.focus()

  handleBlur({ relatedTarget: null, target })

  expect(ViewletSimpleBrowserFunctions.closeSuggestions).toHaveBeenCalledTimes(1)
})

test('moving focus to a suggestion keeps them open for its click', () => {
  const target = document.createElement('input')
  const suggestions = document.createElement('div')
  suggestions.className = 'SimpleBrowserSuggestions'
  const suggestion = document.createElement('button')
  suggestions.append(suggestion)
  document.body.append(target, suggestions)

  handleBlur({ relatedTarget: suggestion, target })

  expect(ViewletSimpleBrowserFunctions.closeSuggestions).not.toHaveBeenCalled()
})

test('replacing the focused input keeps newly rendered suggestions open', () => {
  const target = document.createElement('input')
  document.body.append(target)

  jest.useFakeTimers()
  ViewletSimpleBrowserEvents.handleBlur({ relatedTarget: null, target })
  target.remove()
  jest.runAllTimers()

  expect(ViewletSimpleBrowserFunctions.closeSuggestions).not.toHaveBeenCalled()
})

test('restoring focus to the address input keeps newly rendered suggestions open', () => {
  jest.useFakeTimers()
  const target = document.createElement('input')
  target.name = 'simple-browser-address'
  const replacement = document.createElement('input')
  replacement.name = 'simple-browser-address'
  document.body.append(target, replacement)
  target.focus()

  ViewletSimpleBrowserEvents.handleBlur({ relatedTarget: null, target })
  replacement.focus()
  jest.runAllTimers()

  expect(ViewletSimpleBrowserFunctions.closeSuggestions).not.toHaveBeenCalled()
})
