import { addDropData, type RetainedDropItem } from '@lvce-editor/virtual-dom'

export type DropSessionItem =
  | {
      readonly kind: 'string'
      readonly type: string
      readonly value: string
    }
  | {
      readonly file?: File
      readonly fileSystemHandle?: FileSystemHandle
      readonly kind: 'file'
      readonly type: string
    }

const retainItem = (item: DropSessionItem, index: number): RetainedDropItem => {
  if (item.kind === 'string') {
    return {
      index,
      kind: 'string',
      type: item.type,
      value: Promise.resolve(item.value),
    }
  }
  return {
    file: item.file ?? null,
    fileSystemHandle: Promise.resolve(item.fileSystemHandle),
    index,
    kind: 'file',
    type: item.type,
  }
}

export const createDropSession = (items: readonly DropSessionItem[]): number => {
  return addDropData(items.map(retainItem))
}
