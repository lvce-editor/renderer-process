/**
 * @jest-environment jsdom
 */
import { afterEach, expect, jest, test } from '@jest/globals'
import * as StartupAppearance from '../src/parts/StartupAppearance/StartupAppearance.ts'

afterEach(() => {
  document.documentElement.className = ''
  document.body.replaceChildren()
  localStorage.clear()
  jest.restoreAllMocks()
})

test('applies the startup surface before the AI-native workbench is restored', () => {
  localStorage.setItem('Layout', JSON.stringify({ aiNativeLayout: true }))

  StartupAppearance.initialize()

  expect(document.documentElement.classList.contains('AiNativeLayoutStartup')).toBe(true)
})

test('uses the saved Claude background before the AI-native workbench is restored', () => {
  localStorage.setItem('Layout', JSON.stringify({ aiNativeLayout: true }))
  localStorage.setItem('settings', JSON.stringify({ 'chat2.aiNativeTheme': 'claude' }))

  StartupAppearance.initialize()

  expect(document.documentElement.classList.contains('AiNativeLayoutStartup')).toBe(true)
  expect(document.documentElement.classList.contains('AiNativeLayoutStartupClaude')).toBe(true)
})

test('removes startup classes when the AI-native workbench is ready', async () => {
  localStorage.setItem('Layout', JSON.stringify({ aiNativeLayout: true }))
  StartupAppearance.initialize()

  const workbench = document.createElement('div')
  workbench.className = 'Workbench AiNativeLayout'
  document.body.append(workbench)
  await new Promise((resolve) => setTimeout(resolve, 0))

  expect(document.documentElement.classList.contains('AiNativeLayoutStartup')).toBe(false)
})

test.each([null, JSON.stringify({ aiNativeLayout: false }), JSON.stringify({ aiNativeLayout: 'true' }), 'invalid'])(
  'ignores a missing or invalid saved layout: %s',
  (value) => {
    if (value !== null) localStorage.setItem('Layout', value)

    StartupAppearance.initialize()

    expect(document.documentElement.classList.contains('AiNativeLayoutStartup')).toBe(false)
  },
)

test('ignores malformed settings and keeps the default startup surface', () => {
  localStorage.setItem('Layout', JSON.stringify({ aiNativeLayout: true }))
  localStorage.setItem('settings', 'invalid')

  StartupAppearance.initialize()

  expect(document.documentElement.classList.contains('AiNativeLayoutStartup')).toBe(true)
  expect(document.documentElement.classList.contains('AiNativeLayoutStartupClaude')).toBe(false)
})

test('ignores a storage access error', () => {
  jest.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
    throw new Error('storage unavailable')
  })

  expect(() => StartupAppearance.initialize()).not.toThrow()
  expect(document.documentElement.classList.contains('AiNativeLayoutStartup')).toBe(false)
})
