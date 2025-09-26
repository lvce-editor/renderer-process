import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const getConfiguredRendererWorkerUrl = () => {
  return GetConfiguredWorkerUrl.getConfiguredWorkerUrl('rendererWorkerUrl')
}
