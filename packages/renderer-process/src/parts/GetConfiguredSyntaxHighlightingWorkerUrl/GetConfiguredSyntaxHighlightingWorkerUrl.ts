import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const getConfiguredSyntaxHighlightingWorkerUrl = () => {
  return GetConfiguredWorkerUrl.getConfiguredWorkerUrl('syntaxHighlightingWorkerUrl')
}
