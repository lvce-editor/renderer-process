import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as Result from '../Result/Result.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

const requiredWorkerFns = [RendererWorker.hydrate]
const additionalWorkerFns = [EditorWorker.hydrate, SyntaxHighlightingWorker.hydrate]

const call = (fn: () => Promise<Result.Result<void>>): Promise<Result.Result<void>> => {
  return fn()
}

export const launchWorkers = async () => {
  const workerFns = ShouldLaunchMultipleWorkers.shouldLaunchMultipleWorkers ? [...requiredWorkerFns, ...additionalWorkerFns] : requiredWorkerFns
  const results = await Promise.all(workerFns.map(call))
  const firstError = results.find(Result.isError)
  if (firstError) {
    return firstError
  }
  return Result.success(undefined)
}
