import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const getConfiguredEditorWorkerUrl = () => {
  const editorWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('editorWorkerUrl')
  if (editorWorkerUrl) {
    return editorWorkerUrl
  }
  const workerUrls = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('workerUrls')
  return workerUrls?.['develop.editorWorkerPath'] || ''
}
