/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as DropData from '../src/parts/DropData/DropData.ts'
import { createDropSession } from '../src/parts/TestFrameWork/CreateDropSession.ts'

test('creates an ordered drop session with strings, files, and file system handles', async () => {
  const file = new File(['content'], 'notes.txt', { type: 'text/plain' })
  const fileSystemHandle = { kind: 'file', name: 'notes.txt' } as FileSystemFileHandle
  const dropId = createDropSession([
    { kind: 'string', type: 'text/plain', value: 'hello' },
    { file, fileSystemHandle, kind: 'file', type: 'text/plain' },
  ])

  await expect(
    DropData.get(dropId, {
      formats: ['string', 'file', 'fileSystemHandle'],
      includeElectronFilePaths: false,
    }),
  ).resolves.toEqual([
    { index: 0, kind: 'string', type: 'text/plain', value: 'hello' },
    { file, fileSystemHandle, index: 1, kind: 'file', name: 'notes.txt', type: 'text/plain' },
  ])
})

test('created drop sessions are one-shot', async () => {
  const dropId = createDropSession([{ kind: 'string', type: 'text/plain', value: 'hello' }])
  const options = { formats: ['string'] as const, includeElectronFilePaths: false }

  await expect(DropData.get(dropId, options)).resolves.toHaveLength(1)
  await expect(DropData.get(dropId, options)).rejects.toThrow(`Drop data not found: ${dropId}`)
})
