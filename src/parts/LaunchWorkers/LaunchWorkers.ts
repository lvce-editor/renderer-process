import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const launchMultipleWorkers = false

export const launchWorkers = () => {
  if (launchMultipleWorkers) {
    return Promise.all([RendererWorker.hydrate(), EditorWorker.hydrate()])
  }
  return RendererWorker.hydrate()
}
