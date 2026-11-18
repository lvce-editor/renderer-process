/**
 * @jest-environment jsdom
 */
import { afterEach, expect, test } from '@jest/globals'
import * as Favicon from '../src/parts/Favicon/Favicon.ts'

afterEach(() => {
  Favicon.set('')
  document.head.replaceChildren()
})

test('updates one override and restores the original deployment icon', () => {
  const original = document.createElement('link')
  original.rel = 'shortcut icon'
  original.href = '/chat-view-2/favicon.ico'
  document.head.append(original)
  Favicon.set('https://trello.com/icon-one.png')
  expect(document.head.querySelectorAll('link')).toHaveLength(2)
  expect(document.head.querySelector('link[rel=icon]')!.getAttribute('href')).toBe('https://trello.com/icon-one.png')
  Favicon.set('https://trello.com/icon-two.png')
  expect(document.head.querySelectorAll('link')).toHaveLength(2)
  expect(document.head.querySelector('link[rel=icon]')!.getAttribute('href')).toBe('https://trello.com/icon-two.png')
  Favicon.set('')
  expect([...document.head.children]).toEqual([original])
  expect(original.getAttribute('href')).toBe('/chat-view-2/favicon.ico')
  Favicon.set('')
  expect([...document.head.children]).toEqual([original])
})

test.each(['javascript:alert(1)', 'data:text/html,test', 'ftp://trello.com/icon.png', 'invalid'])(
  'rejects an invalid favicon without changing the current icon: %s',
  (url) => {
    Favicon.set('https://trello.com/current.png')
    expect(() => Favicon.set(url)).toThrow()
    expect(document.head.querySelector('link[rel=icon]')!.getAttribute('href')).toBe('https://trello.com/current.png')
  },
)

test('accepts generated SVG and PNG icons', () => {
  for (const href of [
    'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg"/>'),
    'data:image/png;base64,iVBORw0KGgo=',
  ]) {
    Favicon.set(href)
    expect(document.head.querySelector('link[rel=icon]')!.getAttribute('href')).toBe(href)
  }
})
