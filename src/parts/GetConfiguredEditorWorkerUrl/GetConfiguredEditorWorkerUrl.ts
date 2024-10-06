import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const getConfiguredEditorWorkerUrl = () => {
  return GetConfiguredWorkerUrl.getConfiguredWorkerUrl('editorWorkerUrl')
}
