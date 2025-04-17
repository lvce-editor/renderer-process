import * as FileSystemHandle from './FileSystemHandle.ts'

export const name = 'FileSystemHandle'

export const Commands = {
  addFileHandle: FileSystemHandle.addFileHandle,
  getFileHandles: FileSystemHandle.getFileHandles,
  requestPermission: FileSystemHandle.requestPermission,
}
