import { getFileHandles } from '@lvce-editor/virtual-dom'

export const get = (ids: readonly number[]): Promise<readonly FileSystemHandle[]> => {
  return getFileHandles(ids)
}
