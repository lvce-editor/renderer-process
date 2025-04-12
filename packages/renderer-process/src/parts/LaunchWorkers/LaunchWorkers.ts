import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

const workerFns = [RendererWorker.hydrate, EditorWorker.hydrate, SyntaxHighlightingWorker.hydrate, ExtensionHostWorker.hydrate]

const call = (fn: () => Promise<void>): Promise<void> => {
  return fn()
}

export const launchWorkers = () => {
  if (ShouldLaunchMultipleWorkers.shouldLaunchMultipleWorkers) {
    return Promise.all(workerFns.map(call))
  }
  return RendererWorker.hydrate()
}
