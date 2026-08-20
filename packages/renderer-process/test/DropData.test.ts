import { beforeEach, expect, jest, test } from '@jest/globals'

const getDropData = jest.fn<(dropId: number) => readonly any[]>()
const getFilePathElectron = jest.fn<(file: File) => Promise<string>>()

jest.unstable_mockModule('@lvce-editor/virtual-dom', () => ({
  getDropData,
}))

jest.unstable_mockModule('../src/parts/GetFilePathElectron/GetFilePathElectron.ts', () => ({
  getFilePathElectron,
}))

const DropData = await import('../src/parts/DropData/DropData.ts')

beforeEach(() => {
  jest.resetAllMocks()
  delete globalThis.electronGlobals
})

test('returns requested fields in source order', async () => {
  const file = new File(['content'], 'notes.txt', { type: 'text/plain' })
  const handle = { kind: 'file', name: 'notes.txt' }
  getDropData.mockReturnValue([
    { index: 0, kind: 'string', type: 'text/plain', value: Promise.resolve('hello') },
    { file, fileSystemHandle: Promise.resolve(handle), index: 1, kind: 'file', type: 'text/plain' },
  ])

  await expect(DropData.get(7, { formats: ['string', 'fileSystemHandle'], includeElectronFilePaths: false })).resolves.toEqual([
    { index: 0, kind: 'string', type: 'text/plain', value: 'hello' },
    { fileSystemHandle: handle, index: 1, kind: 'file', name: 'notes.txt', type: 'text/plain' },
  ])
  expect(getDropData).toHaveBeenCalledWith(7)
})

test('does not resolve unrequested values', async () => {
  const item = {
    file: new File(['content'], 'notes.txt'),
    index: 2,
    kind: 'file',
    type: 'text/plain',
  }
  const getFileSystemHandle = jest.fn(() => {
    throw new Error('unrequested file-system handle was read')
  })
  Object.defineProperty(item, 'fileSystemHandle', { get: getFileSystemHandle })
  getDropData.mockReturnValue([item])

  await expect(DropData.get(3, { formats: [], includeElectronFilePaths: false })).resolves.toEqual([])
  expect(getFileSystemHandle).not.toHaveBeenCalled()
  expect(getFilePathElectron).not.toHaveBeenCalled()
})

test('includes Electron paths only when requested', async () => {
  const file = new File(['content'], 'notes.txt')
  getDropData.mockReturnValue([{ file, fileSystemHandle: Promise.resolve(undefined), index: 0, kind: 'file', type: 'text/plain' }])
  getFilePathElectron.mockResolvedValue('/tmp/notes.txt')
  globalThis.electronGlobals = {}

  await expect(DropData.get(1, { formats: [], includeElectronFilePaths: true })).resolves.toEqual([
    { electronFilePath: '/tmp/notes.txt', index: 0, kind: 'file', name: 'notes.txt', type: 'text/plain' },
  ])
  expect(getFilePathElectron).toHaveBeenCalledWith(file)
})

test('rejects invalid formats before consuming the drop', async () => {
  await expect(DropData.get(1, { formats: ['unknown' as any], includeElectronFilePaths: false })).rejects.toThrow('Invalid drop data format: unknown')
  expect(getDropData).not.toHaveBeenCalled()
})
