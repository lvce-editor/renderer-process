import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

/**
 * @returns {number}
 */
export const getPlatform = () => {
  const configuredPlatform = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('platform')
  if (configuredPlatform === 'electron') {
    return PlatformType.Electron
  }
  if (configuredPlatform === 'web') {
    return PlatformType.Web
  }
  if (configuredPlatform === 'remote') {
    return PlatformType.Remote
  }
  // @ts-expect-error
  if (typeof PLATFORM !== 'undefined') {
    // @ts-expect-error
    return PLATFORM
  }
  // @ts-ignore
  if (typeof process !== 'undefined' && process.env.NODE_ENV === 'test') {
    return PlatformType.Remote
  }
  if (globalThis.isElectron) {
    return PlatformType.Electron
  }
  if (typeof location !== 'undefined' && location.search === '?web') {
    return PlatformType.Web
  }
  return PlatformType.Remote
}

export const platform = getPlatform()
