/**
 * @jest-environment jsdom
 */
import { afterEach, expect, test } from '@jest/globals'
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
