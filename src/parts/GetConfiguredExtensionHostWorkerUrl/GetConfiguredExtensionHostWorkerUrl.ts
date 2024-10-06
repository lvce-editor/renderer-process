import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const getConfiguredExtensionHostWorkerUrl = () => {
  return GetConfiguredWorkerUrl.getConfiguredWorkerUrl('extensionHostWorkerUrl')
}
