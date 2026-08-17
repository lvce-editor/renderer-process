import { beforeEach, expect, jest, test } from '@jest/globals'
import type { Rpc } from '@lvce-editor/rpc'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'
import * as DirectViewRpcRegistry from '../src/parts/DirectViewRpcRegistry/DirectViewRpcRegistry.ts'

const createRpc = (): Rpc =>
  ({
    dispose: jest.fn(),
  }) as unknown as Rpc

beforeEach(() => {
  DirectViewRpcRegistry.clear()
})

test('gets the rpc registered for a view', () => {
  const rpc = createRpc()
  DirectViewRpcRegistry.registerRpc('Panel', rpc)
  DirectViewRpcRegistry.registerView(42, 'Panel')

  expect(DirectViewRpcRegistry.get(42)).toBe(rpc)
  expect(DirectViewRpcRegistry.getViewUid('Panel')).toBe(42)
})

test('gets the most recently registered view uid for an rpc', () => {
  DirectViewRpcRegistry.registerView(42, 'QuickPick')
  DirectViewRpcRegistry.registerView(43, 'QuickPick')

  expect(DirectViewRpcRegistry.getViewUid('QuickPick')).toBe(43)
})

test('gets the focused view uid for an rpc', () => {
  const editor = { parentNode: undefined } as unknown as HTMLElement
  const input = { parentNode: editor } as unknown as HTMLElement
  ComponentUid.set(editor, 42)
  DirectViewRpcRegistry.registerView(42, 'Editor')

  expect(DirectViewRpcRegistry.getFocusedViewUid('Editor', input)).toBe(42)
})

test('throws when an rpc has no registered view', () => {
  expect(() => DirectViewRpcRegistry.getViewUid('Explorer')).toThrow('direct view not found: Explorer')
})

test('removes a view route', () => {
  const rpc = createRpc()
  DirectViewRpcRegistry.registerRpc('Panel', rpc)
  DirectViewRpcRegistry.registerView(42, 'Panel')

  DirectViewRpcRegistry.unregisterView(42)

  expect(DirectViewRpcRegistry.get(42)).toBeUndefined()
})

test('disposes a replaced rpc', () => {
  const previous = createRpc()
  const replacement = createRpc()
  DirectViewRpcRegistry.registerRpc('Panel', previous)

  DirectViewRpcRegistry.registerRpc('Panel', replacement)

  expect(previous.dispose).toHaveBeenCalledTimes(1)
})
