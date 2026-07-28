import { expect, test } from '@jest/globals'
import { getEditorCommand } from '../src/parts/EditorOnlyKeyBinding/EditorOnlyKeyBinding.ts'

const event = (key: string, options: Partial<KeyboardEvent> = {}): KeyboardEvent => {
  return {
    altKey: false,
    ctrlKey: false,
    key,
    metaKey: false,
    shiftKey: false,
    ...options,
  } as KeyboardEvent
}

test('maps cursor movement directly to editor worker commands', () => {
  expect(getEditorCommand(event('ArrowLeft'))).toBe('cursorLeft')
  expect(getEditorCommand(event('ArrowRight', { ctrlKey: true }))).toBe('cursorWordRight')
  expect(getEditorCommand(event('ArrowDown', { shiftKey: true }))).toBe('selectDown')
  expect(getEditorCommand(event('Home'))).toBe('cursorHome')
})

test('maps editing shortcuts directly to editor worker commands', () => {
  expect(getEditorCommand(event('a', { ctrlKey: true }))).toBe('selectAll')
  expect(getEditorCommand(event('z', { ctrlKey: true }))).toBe('undo')
  expect(getEditorCommand(event('z', { ctrlKey: true, shiftKey: true }))).toBe('redo')
  expect(getEditorCommand(event('Tab'))).toBe('handleTab')
  expect(getEditorCommand(event('Backspace'))).toBe('deleteLeft')
  expect(getEditorCommand(event('Delete', { ctrlKey: true }))).toBe('deleteWordRight')
})

test('ignores text input handled by beforeinput', () => {
  expect(getEditorCommand(event('a'))).toBe('')
})
