import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as HasFlag from '../HasFlag/HasFlag.ts'

const launchMultipleWorkers = HasFlag.hasFlag('prelaunchWorkers')

export const launchWorkers = () => {
  if (launchMultipleWorkers) {
    return Promise.all([RendererWorker.hydrate(), EditorWorker.hydrate()])
  }
  return RendererWorker.hydrate()
}
