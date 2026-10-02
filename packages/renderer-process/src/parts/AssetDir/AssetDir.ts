import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

const getAssetDir = () => {
  const configuredAssetDir = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('assetDir')
  if (configuredAssetDir) {
    return configuredAssetDir
  }
  // @ts-expect-error
  if (typeof ASSET_DIR !== 'undefined') {
    // @ts-expect-error
    return ASSET_DIR
  }
  if (Platform.platform === PlatformType.Electron) {
    return '../../../../..'
  }
  return ''
}

export const assetDir = getAssetDir()
