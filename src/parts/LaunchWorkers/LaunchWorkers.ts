import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

export const launchWorkers = () => {
  if (ShouldLaunchMultipleWorkers.shouldLaunchMultipleWorkers) {
    return Promise.all([RendererWorker.hydrate(), EditorWorker.hydrate(), SyntaxHighlightingWorker.hydrate(), ExtensionHostWorker.hydrate()])
  }
  return RendererWorker.hydrate()
}
