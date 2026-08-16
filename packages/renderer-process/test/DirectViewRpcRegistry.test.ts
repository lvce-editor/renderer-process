import { beforeEach, expect, jest, test } from '@jest/globals'
import type { Rpc } from '@lvce-editor/rpc'
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
