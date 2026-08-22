import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const getConfiguredDragAndDropWorkerUrl = (): string => {
  const workerUrls = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('workerUrls')
  return workerUrls?.['develop.dragAndDropWorkerPath'] || ''
}
