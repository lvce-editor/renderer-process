import { getFileHandles } from '@lvce-editor/virtual-dom'
import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.ts'

interface DroppedItem {
  readonly file?: File
  readonly kind: string
  readonly path?: string
  readonly type: string
  readonly value: unknown
}

interface FileSystemFileHandleLike {
  readonly getFile: () => Promise<File>
  readonly kind: 'file'
}

const isFileSystemFileHandle = (value: unknown): value is FileSystemFileHandleLike => {
  if (!value || typeof value !== 'object') {
    return false
  }
  const candidate = value as Partial<FileSystemFileHandleLike>
  return candidate.kind === 'file' && typeof candidate.getFile === 'function'
}

const getNativeFile = async (item: DroppedItem): Promise<File | undefined> => {
  if (item.kind === 'file-legacy') {
    return item.value instanceof File ? item.value : undefined
  }
  if (item.file instanceof File) {
    return item.file
  }
  if (isFileSystemFileHandle(item.value)) {
    return item.value.getFile()
  }
  return undefined
}

const addElectronPath = async (item: DroppedItem): Promise<DroppedItem> => {
  if (!globalThis.electronGlobals) {
    return item
  }
  const file = await getNativeFile(item)
  if (!file) {
    return item
  }
  const path = await GetFilePathElectron.getFilePathElectron(file)
  return {
    ...item,
    path,
  }
}

export const get = async (ids: readonly number[]): Promise<readonly unknown[]> => {
  const items = (await getFileHandles(ids)) as unknown as readonly DroppedItem[]
  return Promise.all(items.map(addElectronPath))
}
