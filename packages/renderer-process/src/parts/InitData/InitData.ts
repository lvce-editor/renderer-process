import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as Platform from '../Platform/Platform.ts'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as HotReloadState from '../HotReloadState/HotReloadState.ts'
import * as Layout from '../Layout/Layout.ts'
import * as Location from '../Location/Location.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'

const getConfig = () => {
  const configElement = document.getElementById('Config')
  if (!configElement?.textContent) {
    return {}
  }
  return JSON.parse(configElement.textContent)
}

export const getInitData = () => {
  const initData = {
    Config: {
      ...getConfig(),
      assetDir: AssetDir.assetDir,
      platform: Platform.platform,
      shouldLaunchMultipleWorkers: ShouldLaunchMultipleWorkers.shouldLaunchMultipleWorkers,
      workerUrls: GetConfiguredWorkerUrl.getConfiguredWorkerUrl('workerUrls'),
    },
    hotReload: HotReloadState.get(),
    Layout: {
      bounds: Layout.getBounds(),
    },
    Location: {
      href: Location.getHref(),
    },
  }
  return initData
}
