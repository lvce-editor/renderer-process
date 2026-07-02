import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as ExtensionHostWorker from '../ExtensionHostWorker/ExtensionHostWorker.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as Result from '../Result/Result.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

const workerFns = [RendererWorker.hydrate, EditorWorker.hydrate, SyntaxHighlightingWorker.hydrate, ExtensionHostWorker.hydrate]

const call = (fn: () => Promise<Result.Result<void>>): Promise<Result.Result<void>> => {
  return fn()
}

export const launchWorkers = () => {
  if (ShouldLaunchMultipleWorkers.shouldLaunchMultipleWorkers) {
    return Promise.all(workerFns.map(call)).then((results) => {
      const firstError = results.find(Result.isError)
      if (firstError) {
        return firstError
      }
      return Result.success(undefined)
    })
  }
  return RendererWorker.hydrate()
}
