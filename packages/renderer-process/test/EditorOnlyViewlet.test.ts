/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, test } from '@jest/globals'
import * as EditorOnlyViewlet from '../src/parts/EditorOnlyViewlet/EditorOnlyViewlet.ts'

beforeEach(() => {
  document.body.replaceChildren()
})

test('creates only the editor root and applies its bounds', () => {
  EditorOnlyViewlet.create(701)
  EditorOnlyViewlet.executeCommands([
    ['Viewlet.setBounds', 701, 0, 0, 800, 600],
    ['Viewlet.setFocusContext', 701, 12],
  ])

  expect(document.body.children).toHaveLength(1)
  const element = document.body.firstElementChild as HTMLElement
  expect(element.style.width).toBe('800px')
  expect(element.style.height).toBe('600px')
})

test('rejects workbench render commands', () => {
  expect(() => EditorOnlyViewlet.executeCommands([['Viewlet.createPlaceholder', 'ActivityBar']])).toThrow(
    'Unsupported editor-only render command: Viewlet.createPlaceholder',
  )
})
