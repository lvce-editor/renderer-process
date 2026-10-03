/**
 * @jest-environment jsdom
 */
import { afterEach, expect, jest, test } from '@jest/globals'
import * as Tauri from '../src/parts/Tauri/Tauri.ts'

afterEach(() => {
  Object.defineProperty(window, '__TAURI__', { configurable: true, value: undefined })
})

test('ordinary browser has no Tauri API', async () => {
  expect(Tauri.isAvailable()).toBe(false)
  await expect(Tauri.toggleDevtools()).rejects.toThrow('Tauri is not available')
  await expect(Tauri.openNewWindow()).rejects.toThrow('Tauri is not available')
})

test('dispatches developer tools to the native page API', async () => {
  const invoke = jest.fn<(command: string) => Promise<void>>().mockResolvedValue(undefined)
  Object.defineProperty(window, '__TAURI__', { configurable: true, value: { core: { invoke } } })
  expect(Tauri.isAvailable()).toBe(true)
  await Tauri.toggleDevtools()
  expect(invoke).toHaveBeenCalledWith('toggle_devtools')
})

test('opens a new native window through the page API', async () => {
  const invoke = jest.fn<(command: string) => Promise<void>>().mockResolvedValue(undefined)
  Object.defineProperty(window, '__TAURI__', { configurable: true, value: { core: { invoke } } })
  await Tauri.openNewWindow()
  expect(invoke).toHaveBeenCalledWith('open_new_window')
})

test('propagates native command failures', async () => {
  const invoke = jest.fn<(command: string) => Promise<void>>().mockRejectedValue(new Error('denied'))
  Object.defineProperty(window, '__TAURI__', { configurable: true, value: { core: { invoke } } })
  await expect(Tauri.toggleDevtools()).rejects.toThrow('denied')
  await expect(Tauri.openNewWindow()).rejects.toThrow('denied')
})
