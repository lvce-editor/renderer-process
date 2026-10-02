import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchWorker from '../LaunchWorker/LaunchWorker.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as RendererWorkerUrl from '../RendererWorkerUrl/RendererWorkerUrl.ts'
import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import type * as Result from '../Result/Result.ts'

const getName = (platform: number) => {
  switch (platform) {
    case PlatformType.Electron:
      return 'Renderer Worker (Electron)'
    case PlatformType.Web:
      return 'Renderer Worker (Web)'
    default:
      return 'Renderer Worker'
  }
}

export const launchRendererWorker = async (): Promise<Result.Result<Rpc>> => {
  const name = getName(Platform.platform)
  const url = new URL(RendererWorkerUrl.rendererWorkerUrl, location.href)
  url.searchParams.set(
    'config',
    JSON.stringify({
      assetDir: AssetDir.assetDir,
      platform: Platform.platform,
      workerUrls: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('workerUrls'),
    }),
  )
  return LaunchWorker.launchWorker({
    name,
    url: url.href,
  })
}
