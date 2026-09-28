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

test('dispose removes only the notification returned by create', () => {
  const id = Notification.create('info', 'Continue signing in')
  Notification.create('error', 'Unrelated error')

  Notification.dispose(id)

  expect(Array.from(document.querySelectorAll('.NotificationMessage'), (element) => element.textContent)).toEqual(['Unrelated error'])
  expect(Widget.state.widgetSet.size).toBe(1)
  Notification.dispose(id)
  expect(document.querySelectorAll('.Notification')).toHaveLength(1)
})

test('disposing an already closed notification preserves newer notifications', () => {
  const id = Notification.create('info', 'Continue signing in')
  document.querySelector<HTMLButtonElement>('.NotificationCloseButton')?.click()
  Notification.create('info', 'Another notification')

  Notification.dispose(id)

  expect(document.querySelector('.NotificationMessage')?.textContent).toBe('Another notification')
})

test('disposing the last notification releases its widget container', () => {
  const id = Notification.create('info', 'Continue signing in')

  Notification.dispose(id)

  expect(document.querySelector('.Notification')).toBeNull()
  expect(Widget.state.widgetSet.size).toBe(0)
  expect(document.getElementById('Widgets')).toBeNull()
})

test('dispose supports notifications with options', () => {
  const id = Notification.createWithOptions('info', 'test info', ['Retry'])
  Notification.dispose(id)
  expect(document.querySelector('.Notification')).toBeNull()
})

test('dispose supports notifications within an owning view', () => {
  const parent = document.createElement('div')
  document.body.append(parent)
  setViewletInstance(904, { state: { $Viewlet: parent } })
  try {
    const id = Notification.create('info', 'test info', 904)
    Notification.dispose(id)
    expect(parent.querySelector('.Notification')).toBeNull()
    expect(parent.isConnected).toBe(true)
  } finally {
    parent.remove()
    setViewletInstance(904, undefined)
  }
})

test('dispose ignores ids belonging to other elements', () => {
  const parent = document.createElement('div')
  parent.id = 'OtherElement'
  document.body.append(parent)
  try {
    Notification.dispose(parent.id)
    expect(parent.isConnected).toBe(true)
  } finally {
    parent.remove()
  }
})

test('showWithOptions returns the selected option and removes the notification', async () => {
  const choice = Notification.showWithOptions('info', 'There are no changes to commit', ['Cancel', 'Create Empty Commit'])
  const buttons = document.querySelectorAll<HTMLButtonElement>('.NotificationOption')
  buttons[1].click()
  buttons[1].click()
  await expect(choice).resolves.toBe(1)
  expect(document.querySelector('.Notification')).toBeNull()
  expect(Widget.state.widgetSet.size).toBe(0)
})

test('showWithOptions resolves dismissal without choosing an action', async () => {
  const choice = Notification.showWithOptions('info', 'There are no changes to commit', ['Create Empty Commit'])
  document.querySelector<HTMLButtonElement>('.NotificationCloseButton')?.click()
  await expect(choice).resolves.toBeUndefined()
  expect(Widget.state.widgetSet.size).toBe(0)
})

test('disposing a pending choice resolves dismissal', async () => {
  const choice = Notification.showWithOptions('info', 'Choose an action', ['Continue'])
  const id = document.querySelector('.Notification')!.id
  Notification.dispose(id)
  await expect(choice).resolves.toBeUndefined()
  Notification.dispose(id)
  expect(Widget.state.widgetSet.size).toBe(0)
})

test('simultaneous choices resolve independently', async () => {
  const first = Notification.showWithOptions('info', 'First', ['Continue'])
  const second = Notification.showWithOptions('info', 'Second', ['Continue'])
  const notifications = document.querySelectorAll('.Notification')
  notifications[1].querySelector<HTMLButtonElement>('.NotificationOption')?.click()
  await expect(second).resolves.toBe(0)
  expect(document.querySelectorAll('.Notification')).toHaveLength(1)
  notifications[0].querySelector<HTMLButtonElement>('.NotificationCloseButton')?.click()
  await expect(first).resolves.toBeUndefined()
})
