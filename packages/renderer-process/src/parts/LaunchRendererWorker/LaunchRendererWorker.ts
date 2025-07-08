import type { Rpc } from '@lvce-editor/rpc'
import * as LaunchWorker from '../LaunchWorker/LaunchWorker.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as RendererWorkerUrl from '../RendererWorkerUrl/RendererWorkerUrl.ts'

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

export const launchRendererWorker = async (): Promise<Rpc> => {
  const name = getName(Platform.platform)
  return LaunchWorker.launchWorker({
    name,
    url: RendererWorkerUrl.rendererWorkerUrl,
  })
}
