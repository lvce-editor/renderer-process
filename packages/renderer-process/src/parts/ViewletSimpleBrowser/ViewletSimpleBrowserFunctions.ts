import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const handleInput = (value) => {
  RendererWorker.send('SimpleBrowser.handleInput', value)
}

export const acceptSuggestion = (value: string): void => {
  RendererWorker.send('SimpleBrowser.acceptSuggestion', value)
}

export const closeSuggestions = (): void => {
  RendererWorker.send('SimpleBrowser.closeSuggestions')
}

export const forward = () => {
  RendererWorker.send('SimpleBrowser.forward')
}

export const backward = () => {
  RendererWorker.send('SimpleBrowser.backward')
}

export const reload = () => {
  RendererWorker.send('SimpleBrowser.reload')
}

export const cancelNavigation = () => {
  RendererWorker.send('SimpleBrowser.cancelNavigation')
}

export const openExternal = () => {
  RendererWorker.send('SimpleBrowser.openExternal')
}
