import * as EditorWorkerUrl from '../EditorWorkerUrl/EditorWorkerUrl.ts'
import * as LaunchWorker from '../LaunchWorker/LaunchWorker.ts'

export const launchEditorWorker = async () => {
  return LaunchWorker.launchWorker({
    name: 'Editor Worker',
    url: EditorWorkerUrl.editorWorkerUrl,
  })
}
