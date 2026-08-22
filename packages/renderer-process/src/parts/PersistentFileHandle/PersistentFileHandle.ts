import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const addHandle = (uri: string, handle: FileSystemHandle): Promise<void> => {
  return RendererWorker.invoke('PersistentFileHandle.addHandle', uri, handle)
}
