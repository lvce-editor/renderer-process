/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, test } from '@jest/globals'
import { getEditorOnlyConfig } from '../src/parts/EditorOnlyConfig/EditorOnlyConfig.ts'

beforeEach(() => {
  document.body.replaceChildren()
})

test('returns the standalone editor configuration', () => {
  const config = document.createElement('script')
  config.id = 'Config'
  config.type = 'application/json'
  config.textContent = JSON.stringify({
    editorOnly: {
      content: '<h1>Hello</h1>',
      languageId: 'html',
    },
  })
  document.body.append(config)

  expect(getEditorOnlyConfig()).toEqual({
    content: '<h1>Hello</h1>',
    languageId: 'html',
  })
})

test('returns an empty configuration when no config exists', () => {
  expect(getEditorOnlyConfig()).toEqual({})
})
