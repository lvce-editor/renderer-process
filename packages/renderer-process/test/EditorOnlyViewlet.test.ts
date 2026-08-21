/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
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

test('supports selector scrolling commands', () => {
  const scrollIntoView = jest.fn()
  EditorOnlyViewlet.create(702)
  const root = document.body.firstElementChild as HTMLElement
  const tabs = document.createElement('div')
  tabs.className = 'Tabs'
  tabs.scrollLeft = 20
  Object.defineProperty(tabs, 'scrollIntoView', { value: scrollIntoView })
  root.append(tabs)

  EditorOnlyViewlet.executeCommands([
    ['Viewlet.scrollSelectorBy', 702, '.Tabs', 30],
    ['Viewlet.scrollSelectorIntoView', 702, '.Tabs'],
  ])

  expect(tabs.scrollLeft).toBe(50)
  expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' })
})
