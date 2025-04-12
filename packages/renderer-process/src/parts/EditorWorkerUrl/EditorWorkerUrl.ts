import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as GetConfiguredEditorWorkerUrl from '../GetConfiguredEditorWorkerUrl/GetConfiguredEditorWorkerUrl.ts'

export const editorWorkerUrl =
  GetConfiguredEditorWorkerUrl.getConfiguredEditorWorkerUrl() ||
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/editor-worker/dist/editorWorkerMain.js`
