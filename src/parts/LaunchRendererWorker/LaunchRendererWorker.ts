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

export const launchRendererWorker = async () => {
  const name = getName(Platform.platform)
  console.log({ name, p: Platform.platform, s: location.search })
  return LaunchWorker.launchWorker({
    name,
    url: RendererWorkerUrl.rendererWorkerUrl,
  })
}
