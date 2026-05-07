/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as EditorError from '../src/parts/EditorError/EditorError.ts'

test('create', () => {
  const state = EditorError.create('no definition found', 10, 20)
  const $EditorError = state.$EditorError
  expect($EditorError).toBeDefined()
  expect($EditorError.isConnected).toBe(true)
  expect($EditorError.style.left).toBe('10px')
  expect($EditorError.style.top).toBe('20px')
})

test('dispose', () => {
  const state = EditorError.create('no definition found', 10, 20)
  EditorError.dispose(state)
})
