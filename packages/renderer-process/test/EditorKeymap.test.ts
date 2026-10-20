/**
 * @jest-environment jsdom
 */
import { afterEach, beforeEach, expect, jest, test } from '@jest/globals'

const send = jest.fn()
const invoke = jest.fn<(...args: readonly unknown[]) => Promise<void>>(async () => {})
jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => ({ invoke, send }))
const EditorKeymap = await import('../src/parts/EditorKeymap/EditorKeymap.ts')
const KeyBindingsEvents = await import('../src/parts/KeyBindingsEvents/KeyBindingsEvents.ts')
const EditorEventQueue = await import('../src/parts/EditorEventQueue/EditorEventQueue.ts')

const keymap = {
  initialMode: 'normal',
  modes: {
    insert: { bindings: { Escape: { mode: 'normal' } } },
    normal: {
      bindings: { h: { command: 'Editor.cursorCharacterLeft' }, i: { mode: 'insert' } },
      captureText: true,
    },
  },
}

const press = (key: string, selector = '#preview', options: KeyboardEventInit = {}): KeyboardEvent => {
  const event = new KeyboardEvent('keydown', { bubbles: true, cancelable: true, key, ...options })
  document.querySelector(selector)!.dispatchEvent(event)
  return event
}

beforeEach(() => {
  document.body.innerHTML = `<div id="Workbench-1"><div class="Editor"><div class="EditorInput"><textarea id="preview"></textarea></div><textarea id="other-textarea"></textarea></div><input id="search"></div>
    <div id="Workbench-2"><div class="Editor"><div class="EditorInput"><textarea id="source"></textarea></div></div></div>`
  document.body.addEventListener('keydown', KeyBindingsEvents.handleKeyDown)
  EditorKeymap.register('Workbench-1', 1, keymap)
  send.mockClear()
  invoke.mockReset()
  invoke.mockImplementation(async () => {})
})

afterEach(async () => {
  await EditorEventQueue.runShortcut(async () => {})
  EditorKeymap.remove('Workbench-1', 1)
  document.body.removeEventListener('keydown', KeyBindingsEvents.handleKeyDown)
})

test('normal keys move without text; unbound typing and editing keys are consumed', async () => {
  expect(press('h').defaultPrevented).toBe(true)
  await EditorEventQueue.runShortcut(async () => {})
  expect(invoke).toHaveBeenCalledWith('EditorKeymap.execute', 1, 'Editor.cursorCharacterLeft')
  for (const key of ['q', 'H', 'Enter', 'Backspace', 'Delete']) expect(press(key).defaultPrevented).toBe(true)
  expect(invoke).toHaveBeenCalledTimes(1)
})

test('mode changes take effect synchronously for rapid typing and repeated transitions', async () => {
  for (let index = 0; index < 3; index++) {
    expect(press('i').defaultPrevented).toBe(true)
    for (const key of 'hello') expect(press(key).defaultPrevented).toBe(false)
    expect(press('Escape').defaultPrevented).toBe(true)
    expect(press('h').defaultPrevented).toBe(true)
  }
  await EditorEventQueue.runShortcut(async () => {})
  expect(invoke).toHaveBeenCalledTimes(3)
})

test('other applications, other inputs and modified shortcuts keep their behavior', () => {
  expect(press('h', '#source').defaultPrevented).toBe(false)
  expect(press('h', '#search').defaultPrevented).toBe(false)
  expect(press('h', '#other-textarea').defaultPrevented).toBe(false)
  expect(press('h', '#preview', { ctrlKey: true }).defaultPrevented).toBe(false)
  expect(press('h', '#preview', { metaKey: true }).defaultPrevented).toBe(false)
  expect(press('h', '#preview', { altKey: true }).defaultPrevented).toBe(false)
  expect(send).not.toHaveBeenCalled()
})

test('normal mode suppresses beforeinput, including paste and composition; insert mode allows it', () => {
  const input = (): InputEvent => {
    const event = new InputEvent('beforeinput', { bubbles: true, cancelable: true, data: 'text', inputType: 'insertFromPaste' })
    document.querySelector('#preview')!.dispatchEvent(event)
    return event
  }
  expect(input().defaultPrevented).toBe(true)
  press('i')
  expect(input().defaultPrevented).toBe(false)
  press('Escape')
  expect(input().defaultPrevented).toBe(true)
})

test('disposal restores typing and removes the beforeinput listener; stale disposal cannot remove a replacement', () => {
  EditorKeymap.remove('Workbench-1', 1)
  expect(press('h').defaultPrevented).toBe(false)
  const event = new InputEvent('beforeinput', { bubbles: true, cancelable: true })
  document.querySelector('#preview')!.dispatchEvent(event)
  expect(event.defaultPrevented).toBe(false)
  EditorKeymap.register('Workbench-1', 2, keymap)
  EditorKeymap.remove('Workbench-1', 1)
  expect(press('h').defaultPrevented).toBe(true)
  EditorKeymap.remove('Workbench-1', 2)
})

test('invalid mode targets and duplicate registrations fail before installing listeners', () => {
  expect(() => EditorKeymap.register('Workbench-1', 2, keymap)).toThrow('already registered')
  expect(() => EditorKeymap.register('Workbench-2', 2, { initialMode: 'missing', modes: {} })).toThrow('Unknown initial')
  expect(() =>
    EditorKeymap.register('Workbench-2', 2, {
      initialMode: 'normal',
      modes: { normal: { bindings: { i: { mode: 'missing' } } } },
    }),
  ).toThrow('Unknown editor keymap mode')
  expect(press('h', '#source').defaultPrevented).toBe(false)
})

test('cursor override is local and disposal restores the previous preference', () => {
  EditorKeymap.remove('Workbench-1', 1)
  const root = document.getElementById('Workbench-1')!
  root.style.setProperty('--EditorCursorWidth', '3px', 'important')
  EditorKeymap.register('Workbench-1', 1, { ...keymap, cursorStyle: 'block' })
  expect(root.style.getPropertyValue('--EditorCursorWidth')).toBe('1ch')
  expect(root.style.getPropertyValue('--EditorCursorOpacity')).toBe('0.5')
  expect(document.getElementById('Workbench-2')!.style.getPropertyValue('--EditorCursorWidth')).toBe('')
  EditorKeymap.remove('Workbench-1', 1)
  expect(root.style.getPropertyValue('--EditorCursorWidth')).toBe('3px')
  expect(root.style.getPropertyValue('--EditorCursorOpacity')).toBe('')
})

test('a cursor command finishes before native typing after a mode transition', async () => {
  EditorKeymap.remove('Workbench-1', 1)
  EditorKeymap.register('Workbench-1', 1, {
    ...keymap,
    modes: { ...keymap.modes, normal: { bindings: { a: { command: 'Editor.cursorCharacterRight', mode: 'insert' } }, captureText: true } },
  })
  const events: string[] = []
  const movement = Promise.withResolvers<void>()
  invoke.mockImplementationOnce(async () => {
    events.push('move')
    await movement.promise
  })
  expect(press('a').defaultPrevented).toBe(true)
  const input = EditorEventQueue.runInput(async () => {
    events.push('type')
  })
  await Promise.resolve()
  await Promise.resolve()
  try {
    expect(events).toEqual(['move'])
  } finally {
    movement.resolve()
    await input
  }
  expect(events).toEqual(['move', 'type'])
})
