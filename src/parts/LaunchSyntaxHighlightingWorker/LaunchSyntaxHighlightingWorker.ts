import * as LaunchWorker from '../LaunchWorker/LaunchWorker.ts'
import * as SyntaxHighlightingWorkerUrl from '../SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.ts'

export const launchSyntaxHighlightingWorker = async () => {
  return LaunchWorker.launchWorker({
    name: 'Syntax Highlighting Worker',
    url: SyntaxHighlightingWorkerUrl.syntaxHighlightingWorkerUrl,
  })
}
