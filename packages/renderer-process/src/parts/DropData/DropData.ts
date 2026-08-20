import * as VirtualDom from '@lvce-editor/virtual-dom'
import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.ts'

export type DropDataFormat = 'file' | 'fileSystemHandle' | 'string'

export interface DropDataOptions {
  readonly formats: readonly DropDataFormat[]
  readonly includeElectronFilePaths: boolean
}

interface RetainedDropStringItem {
  readonly index: number
  readonly kind: 'string'
  readonly type: string
  readonly value: Promise<string>
}

interface RetainedDropFileItem {
  readonly file: File | null
  readonly fileSystemHandle: Promise<FileSystemHandle | undefined>
  readonly index: number
  readonly kind: 'file'
  readonly type: string
}

type RetainedDropItem = RetainedDropFileItem | RetainedDropStringItem

export interface DropDataStringItem {
  readonly index: number
  readonly kind: 'string'
  readonly type: string
  readonly value: string
}

export interface DropDataFileItem {
  readonly electronFilePath?: string
  readonly file?: File
  readonly fileSystemHandle?: FileSystemHandle
  readonly index: number
  readonly kind: 'file'
  readonly name: string
  readonly type: string
}

export type DropDataItem = DropDataFileItem | DropDataStringItem

const validFormats = new Set<DropDataFormat>(['file', 'fileSystemHandle', 'string'])

const validateOptions = (options: DropDataOptions): void => {
  if (!options || !Array.isArray(options.formats) || typeof options.includeElectronFilePaths !== 'boolean') {
    throw new TypeError('Invalid drop data options')
  }
  for (const format of options.formats) {
    if (!validFormats.has(format)) {
      throw new TypeError(`Invalid drop data format: ${format}`)
    }
  }
}

const resolveString = async (item: RetainedDropStringItem): Promise<DropDataStringItem> => {
  return {
    index: item.index,
    kind: 'string',
    type: item.type,
    value: await item.value,
  }
}

const resolveFile = async (
  item: RetainedDropFileItem,
  formats: ReadonlySet<DropDataFormat>,
  includeElectronFilePaths: boolean,
): Promise<DropDataFileItem | undefined> => {
  const includeFile = formats.has('file')
  const includeFileSystemHandle = formats.has('fileSystemHandle')
  const fileSystemHandle = includeFileSystemHandle ? await item.fileSystemHandle : undefined
  const electronFilePath =
    includeElectronFilePaths && globalThis.electronGlobals && item.file ? await GetFilePathElectron.getFilePathElectron(item.file) : undefined
  if ((!includeFile || !item.file) && !fileSystemHandle && electronFilePath === undefined) {
    return undefined
  }
  return {
    ...(electronFilePath !== undefined && { electronFilePath }),
    ...(includeFile && item.file && { file: item.file }),
    ...(fileSystemHandle && { fileSystemHandle }),
    index: item.index,
    kind: 'file',
    name: fileSystemHandle?.name || item.file?.name || '',
    type: item.type,
  }
}

export const get = async (dropId: number, options: DropDataOptions): Promise<readonly DropDataItem[]> => {
  validateOptions(options)
  const getDropData = (VirtualDom as any).getDropData as (dropId: number) => readonly RetainedDropItem[]
  const retainedItems = getDropData(dropId)
  const formats = new Set(options.formats)
  const items: DropDataItem[] = []
  for (const retainedItem of retainedItems) {
    if (retainedItem.kind === 'string') {
      if (formats.has('string')) {
        items.push(await resolveString(retainedItem))
      }
      continue
    }
    const item = await resolveFile(retainedItem, formats, options.includeElectronFilePaths)
    if (item) {
      items.push(item)
    }
  }
  return items
}
