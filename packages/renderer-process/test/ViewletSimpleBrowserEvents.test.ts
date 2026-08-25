/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'

beforeEach(() => {
  jest.clearAllMocks()
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

const ViewletSimpleBrowserEvents = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserEvents.ts')
const ViewletSimpleBrowserFunctions = await import('../src/parts/ViewletSimpleBrowser/ViewletSimpleBrowserFunctions.ts')

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

  ViewletSimpleBrowserEvents.handleBlur({ relatedTarget: null, target })

  expect(ViewletSimpleBrowserFunctions.closeSuggestions).toHaveBeenCalledTimes(1)
})

test('moving focus to a suggestion keeps them open for its click', () => {
  const target = document.createElement('input')
  const suggestions = document.createElement('div')
  suggestions.className = 'SimpleBrowserSuggestions'
  const suggestion = document.createElement('button')
  suggestions.append(suggestion)

  ViewletSimpleBrowserEvents.handleBlur({ relatedTarget: suggestion, target })

  expect(ViewletSimpleBrowserFunctions.closeSuggestions).not.toHaveBeenCalled()
})
