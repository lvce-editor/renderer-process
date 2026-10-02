import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'

export const getConfiguredSyntaxHighlightingWorkerUrl = () => {
  const syntaxHighlightingWorkerUrl = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('syntaxHighlightingWorkerUrl')
  if (syntaxHighlightingWorkerUrl) {
    return syntaxHighlightingWorkerUrl
  }
  const workerUrls = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('workerUrls')
  return workerUrls?.['developer.syntaxHighlightingWorkerPath'] || ''
}
