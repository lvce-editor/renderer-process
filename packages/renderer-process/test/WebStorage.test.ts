/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import { commandMap } from '../src/parts/CommandMap/CommandMap.ts'
import * as WebStorage from '../src/parts/WebStorage/WebStorage.ts'
import * as WebStorageType from '../src/parts/WebStorageType/WebStorageType.ts'

test('getAll - localStorage through command map', () => {
  window.localStorage.clear()
  window.localStorage.setItem('sample', 'abc')
  expect(commandMap['WebStorage.getAll'](WebStorageType.LocalStorage)).toEqual({ sample: 'abc' })
})

test('getAll - sessionStorage through command map', () => {
  window.sessionStorage.clear()
  window.sessionStorage.setItem('sample', 'abc')
  expect(commandMap['WebStorage.getAll'](WebStorageType.SessionStorage)).toEqual({ sample: 'abc' })
})

test('getItem - localStorage', () => {
  WebStorage.setItem(WebStorageType.LocalStorage, 'sample', 'abc')
  expect(WebStorage.getItem(WebStorageType.LocalStorage, 'sample')).toBe('abc')
})

test('getItem - localStorage - empty', () => {
  expect(WebStorage.getItem(WebStorageType.LocalStorage, 'non-existent')).toBeUndefined()
})

test('getItem - localStorage - number should be converted to string', () => {
  WebStorage.setItem(WebStorageType.LocalStorage, 'sample', 1)
  expect(WebStorage.getItem(WebStorageType.LocalStorage, 'sample')).toBe('1')
})

test('clear', () => {
  WebStorage.setItem(WebStorageType.LocalStorage, 'a', 'b')
  WebStorage.clear(WebStorageType.LocalStorage)
  expect(WebStorage.getItem(WebStorageType.LocalStorage, 'a')).toBeUndefined()
})
