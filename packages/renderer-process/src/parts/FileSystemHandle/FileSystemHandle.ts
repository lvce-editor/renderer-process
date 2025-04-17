import * as VirtualDom from '@lvce-editor/virtual-dom'

export const requestPermission = (handle, options) => {
  return handle.requestPermission(options)
}

export const getFileHandles = (ids: readonly number[]): Promise<readonly FileSystemHandle[]> => {
  return VirtualDom.getFileHandles(ids)
}

export const addFileHandle = (fileHandle: FileSystemHandle): number => {
  return VirtualDom.addFileHandle(fileHandle)
}
