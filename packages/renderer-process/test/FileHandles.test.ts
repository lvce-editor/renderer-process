import { beforeEach, expect, jest, test } from '@jest/globals'

const getFileHandles = jest.fn<(ids: readonly number[]) => Promise<readonly any[]>>()
const getFilePathElectron = jest.fn<(file: File) => Promise<string>>()

jest.unstable_mockModule('@lvce-editor/virtual-dom', () => ({
  getFileHandles,
}))

jest.unstable_mockModule('../src/parts/GetFilePathElectron/GetFilePathElectron.ts', () => ({
  getFilePathElectron,
}))

const FileHandles = await import('../src/parts/FileHandles/FileHandles.ts')

beforeEach(() => {
  jest.resetAllMocks()
  delete globalThis.electronGlobals
})

test('resolves an Electron file path before the file crosses a worker boundary', async () => {
  const file = new File(['content'], 'notes.txt')
  const handle = { getFile: jest.fn(async () => file), kind: 'file', name: 'notes.txt' }
  const item = { kind: 'file', type: 'text/plain', value: handle }
  getFileHandles.mockResolvedValue([item])
  getFilePathElectron.mockResolvedValue('/tmp/notes.txt')
  globalThis.electronGlobals = {}

  await expect(FileHandles.get([1])).resolves.toEqual([{ ...item, path: '/tmp/notes.txt' }])
  expect(handle.getFile).toHaveBeenCalledTimes(1)
  expect(getFilePathElectron).toHaveBeenCalledWith(file)
})

test('uses a native file already attached to a dropped handle', async () => {
  const file = new File(['content'], 'notes.txt')
  const item = { file, kind: 'file', type: 'text/plain', value: { kind: 'file', name: 'notes.txt' } }
  getFileHandles.mockResolvedValue([item])
  getFilePathElectron.mockResolvedValue('/tmp/notes.txt')
  globalThis.electronGlobals = {}

  await expect(FileHandles.get([1])).resolves.toEqual([{ ...item, path: '/tmp/notes.txt' }])
  expect(getFilePathElectron).toHaveBeenCalledWith(file)
})

test('does not resolve file paths outside Electron', async () => {
  const file = new File(['content'], 'notes.txt')
  const item = { kind: 'file-legacy', type: 'text/plain', value: file }
  getFileHandles.mockResolvedValue([item])

  await expect(FileHandles.get([1])).resolves.toEqual([item])
  expect(getFilePathElectron).not.toHaveBeenCalled()
})
