/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as KeyCode from '../src/parts/KeyCode/KeyCode.ts'
import * as KeyModifier from '../src/parts/KeyModifier/KeyModifier.ts'

beforeEach(() => {
  jest.resetAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    send: jest.fn(() => {}),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.ts')
const KeyBindings = await import('../src/parts/KeyBindings/KeyBindings.ts')
const KeyBindingsEvents = await import('../src/parts/KeyBindingsEvents/KeyBindingsEvents.ts')
const KeyBindingsState = await import('../src/parts/KeyBindingsState/KeyBindingsState.ts')

beforeEach(() => {
  // @ts-ignore
  if (KeyBindingsState.state.modifierTimeout !== -1) {
    // @ts-ignore
    clearTimeout(KeyBindingsState.state.modifierTimeout)
    // @ts-ignore
    KeyBindingsState.state.modifierTimeout = -1
  }
  // @ts-ignore
  KeyBindingsState.state.modifier = ''
  // @ts-ignore
  KeyBindingsState.state.keyBindingSets = Object.create(null)
  // @ts-ignore
  KeyBindingsState.state.keyBindings = []
})

test('addKeyBindings', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyCode.KeyA)
})

test('addKeyBindings - dispatch event with no matching keyBinding', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'b',
    }),
  )
  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('addKeyBindings - dispatch Event with context matching', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyCode.KeyA)
})

test('addKeyBindings - dispatch event with ctrl modifier', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyModifier.CtrlCmd | KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
      ctrlKey: true,
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyModifier.CtrlCmd | KeyCode.KeyA)
})

test('addKeyBindings - dispatch event with shift modifier', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyModifier.Shift | KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
      shiftKey: true,
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyModifier.Shift | KeyCode.KeyA)
})

test('addKeyBindings - dispatch event with alt modifier', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyModifier.Alt | KeyCode.KeyA]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: 'a',
      altKey: true,
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyModifier.Alt | KeyCode.KeyA)
})

test('addKeyBindings - dispatch event with space key', () => {
  KeyBindings.setIdentifiers(new Uint32Array([KeyCode.Space]))
  KeyBindingsEvents.handleKeyDown(
    new KeyboardEvent('keydown', {
      key: ' ',
    }),
  )
  expect(RendererWorker.send).toHaveBeenCalledWith('KeyBindings.handleKeyBinding', KeyCode.Space)
})
