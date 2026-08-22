import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const writeFile = (uri: string, content: string): Promise<void> => {
  return RendererWorker.invoke('FileSystem.writeFile', uri, content)
}
