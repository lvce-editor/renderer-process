import * as EditorWorker from '../EditorWorker/EditorWorker.ts'
import * as GetConfiguredWorkerUrl from '../GetConfiguredWorkerUrl/GetConfiguredWorkerUrl.ts'
import * as PreloadWorker from '../PreloadWorker/PreloadWorker.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as Result from '../Result/Result.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'
import * as SyntaxHighlightingWorker from '../SyntaxHighlightingWorker/SyntaxHighlightingWorker.ts'

const defaultPreloadWorkers = [
  'rendererWorker',
  'editorWorker',
  'syntaxHighlightingWorker',
  'extensionManagementWorker',
  'fileSystemWorker',
  'activityBarWorker',
  'mainAreaWorker',
  'statusBarWorker',
  'iconThemeWorker',
]

const additionalWorkerFns: Record<string, () => Promise<Result.Result<void>>> = {
  activityBarWorker: () =>
    PreloadWorker.preloadWorker('Activity Bar Worker', 'activity-bar-worker', 'activityBarWorkerMain.js', 'develop.activityBarWorkerPath'),
  editorWorker: EditorWorker.hydrate,
  extensionManagementWorker: () =>
    PreloadWorker.preloadWorker(
      'Extension Management Worker',
      'extension-management-worker',
      'extensionManagementWorkerMain.js',
      'develop.extensionManagementWorkerPath',
    ),
  fileSystemWorker: () =>
    PreloadWorker.preloadWorker('File System Worker', 'file-system-worker', 'fileSystemWorkerMain.js', 'develop.fileSystemWorkerPath'),
  iconThemeWorker: () =>
    PreloadWorker.preloadWorker('Icon Theme Worker', 'icon-theme-worker', 'iconThemeWorkerMain.js', 'develop.iconThemeWorkerPath'),
  mainAreaWorker: () => PreloadWorker.preloadWorker('Main Area Worker', 'main-area-worker', 'mainAreaWorkerMain.js', 'develop.mainAreaWorkerPath'),
  statusBarWorker: () =>
    PreloadWorker.preloadWorker('Status Bar Worker', 'status-bar-worker', 'statusBarWorkerMain.js', 'develop.statusBarWorkerPath'),
  syntaxHighlightingWorker: SyntaxHighlightingWorker.hydrate,
}

export const launchWorkers = async () => {
  const configured = GetConfiguredWorkerUrl.getConfiguredWorkerUrl('preloadWorkers')
  const preloadWorkers = Array.isArray(configured) ? configured : defaultPreloadWorkers
  // Renderer Worker is the application bootstrap and always starts. Unknown IDs are ignored.
  const optionalWorkers = ShouldLaunchMultipleWorkers.shouldLaunchMultipleWorkers
    ? [...new Set(preloadWorkers)].filter((id) => Object.hasOwn(additionalWorkerFns, id)).map((id) => additionalWorkerFns[id])
    : []
  const results = await Promise.all([RendererWorker.hydrate(), ...optionalWorkers.map((fn) => fn())])
  const firstError = results.find(Result.isError)
  if (firstError) {
    return firstError
  }
  return Result.success(undefined)
}
