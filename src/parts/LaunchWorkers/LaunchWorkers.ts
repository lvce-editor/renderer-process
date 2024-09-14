import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as HasFlag from '../HasFlag/HasFlag.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

const launchMultipleWorkers = HasFlag.hasFlag('prelaunchWorkers')

export const launchWorkers = () => {
  if (launchMultipleWorkers) {
    return Promise.all([RendererWorker.hydrate(), EditorWorker.hydrate(), SyntaxHighlightingWorker.hydrate(), ExtensionHostWorker.hydrate()])
  }
  return RendererWorker.hydrate()
}
