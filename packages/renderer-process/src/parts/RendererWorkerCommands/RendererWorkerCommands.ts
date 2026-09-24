import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const openUri = (uri: string): Promise<unknown> => {
  return RendererWorker.invoke('Main.openUri', uri)
}

export const setUri = (uri: string): Promise<unknown> => {
  return RendererWorker.invoke('Workspace.setUri', uri)
}
