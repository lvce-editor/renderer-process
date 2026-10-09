/**
 * @jest-environment jsdom
 */
import { afterEach, expect, test } from '@jest/globals'
import { getConfiguredSyntaxHighlightingWorkerUrl } from '../src/parts/GetConfiguredSyntaxHighlightingWorkerUrl/GetConfiguredSyntaxHighlightingWorkerUrl.ts'

afterEach(() => {
  document.body.replaceChildren()
  document.head.replaceChildren()
})

const setConfig = (config: object): void => {
  const configElement = document.createElement('script')
  configElement.id = 'Config'
  configElement.type = 'application/json'
  configElement.textContent = JSON.stringify(config)
  document.head.append(configElement)
}

test('getConfiguredSyntaxHighlightingWorkerUrl reads the canonical worker path setting', () => {
  setConfig({ workerUrls: { 'develop.syntaxHighlightingWorkerPath': '/custom/syntax-highlighting-worker.js' } })

  expect(getConfiguredSyntaxHighlightingWorkerUrl()).toBe('/custom/syntax-highlighting-worker.js')
})

test('getConfiguredSyntaxHighlightingWorkerUrl prefers the explicit worker URL', () => {
  setConfig({
    syntaxHighlightingWorkerUrl: '/explicit/syntax-highlighting-worker.js',
    workerUrls: { 'develop.syntaxHighlightingWorkerPath': '/custom/syntax-highlighting-worker.js' },
  })

  expect(getConfiguredSyntaxHighlightingWorkerUrl()).toBe('/explicit/syntax-highlighting-worker.js')
})

test('getConfiguredSyntaxHighlightingWorkerUrl returns an empty URL when no override is configured', () => {
  setConfig({ workerUrls: {} })

  expect(getConfiguredSyntaxHighlightingWorkerUrl()).toBe('')
})
