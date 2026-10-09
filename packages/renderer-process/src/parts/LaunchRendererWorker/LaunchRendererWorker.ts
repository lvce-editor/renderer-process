import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchWorker from '../LaunchWorker/LaunchWorker.ts'
import * as RendererWorkerUrl from '../RendererWorkerUrl/RendererWorkerUrl.ts'
import type * as Result from '../Result/Result.ts'

export const launchRendererWorker = async (): Promise<Result.Result<Rpc>> => {
  const url = new URL(RendererWorkerUrl.rendererWorkerUrl, location.href)
  return LaunchWorker.launchWorker({
    name: 'Renderer Worker',
    url: url.href,
  })
}
