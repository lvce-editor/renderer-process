/**
 * @jest-environment jsdom
 */
import { expect, jest, test } from '@jest/globals'
import { fileSaved } from '../src/parts/ApplicationHost/ApplicationHost.ts'

test('reports the owning application and saved URI to the browser host', () => {
  const listener = jest.fn()
  window.addEventListener('lvce-file-saved', listener)
  try {
    fileSaved('source', 'memfs:///src/main.ts')
    expect(listener).toHaveBeenCalledTimes(1)
    const [event] = listener.mock.calls[0] as [CustomEvent]
    expect(event.detail).toEqual({ applicationId: 'source', uri: 'memfs:///src/main.ts' })
  } finally {
    window.removeEventListener('lvce-file-saved', listener)
  }
})
