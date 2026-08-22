import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as GetConfiguredDragAndDropWorkerUrl from '../GetConfiguredDragAndDropWorkerUrl/GetConfiguredDragAndDropWorkerUrl.ts'

export const dragAndDropWorkerUrl =
  GetConfiguredDragAndDropWorkerUrl.getConfiguredDragAndDropWorkerUrl() ||
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/drag-and-drop-worker/dist/dragAndDropWorkerMain.js`
