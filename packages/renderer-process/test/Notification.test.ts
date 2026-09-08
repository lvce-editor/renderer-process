/**
 * @jest-environment jsdom
 */
import { afterEach, expect, test } from '@jest/globals'
import { setViewletInstance } from '@lvce-editor/virtual-dom'
import * as Widget from '../src/parts/Widget/Widget.ts'
import * as Notification from '../src/parts/Notification/Notification.ts'

afterEach(() => {
  for (const $CloseButton of document.querySelectorAll<HTMLButtonElement>('.NotificationCloseButton')) {
    $CloseButton.click()
  }
})

// TODO test dispose
test('Notification', () => {
  Notification.create('info', 'test info')
  Notification.create('error', 'test error')
  expect(document.querySelectorAll('.Notification')).toHaveLength(2)
})

test('close button', () => {
  Notification.create('info', 'test info')

  const $Notification = document.querySelector('.Notification')
  const $CloseButton = document.querySelector<HTMLButtonElement>('.NotificationCloseButton')

  expect($Notification).not.toBeNull()
  expect($CloseButton?.ariaLabel).toBe('Close')
  expect($CloseButton?.title).toBe('Close')

  $CloseButton?.click()

  expect(document.querySelector('.Notification')).toBeNull()
})

test('close button with options', () => {
  Notification.createWithOptions('info', 'test info', ['Retry'])

  const $CloseButton = document.querySelector<HTMLButtonElement>('.NotificationCloseButton')
  $CloseButton?.click()

  expect(document.querySelector('.Notification')).toBeNull()
})

test('notifications stay within their owning view and close independently', () => {
  const source = document.createElement('div')
  const preview = document.createElement('div')
  document.body.append(source, preview)
  setViewletInstance(901, { state: { $Viewlet: source } })
  setViewletInstance(902, { state: { $Viewlet: preview } })
  try {
    Notification.create('info', 'Source message', 901)
    Notification.create('info', 'Hello World!', 902)
    expect(source.querySelector('.NotificationMessage')?.textContent).toBe('Source message')
    expect(preview.querySelector('.NotificationMessage')?.textContent).toBe('Hello World!')
    expect(Widget.state.widgetSet.size).toBe(0)
    preview.querySelector<HTMLButtonElement>('.NotificationCloseButton')?.click()
    expect(preview.querySelector('.Notification')).toBeNull()
    expect(source.querySelector('.Notification')).not.toBeNull()
    Notification.create('info', 'Hello again!', 902)
    preview.remove()
    expect(Widget.state.widgetSet.size).toBe(0)
    expect(document.querySelectorAll('.Notification')).toHaveLength(1)
  } finally {
    source.remove()
    preview.remove()
    setViewletInstance(901, undefined)
    setViewletInstance(902, undefined)
  }
})

test('a missing notification parent never falls back to the global widget container', () => {
  expect(() => Notification.create('info', 'Late message', 903)).toThrow('Notification parent not found: 903')
  expect(document.querySelector('.Notification')).toBeNull()
})
