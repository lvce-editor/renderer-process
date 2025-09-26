import * as AssetDir from '../AssetDir/AssetDir.ts'
import { getConfiguredSyntaxHighlightingWorkerUrl } from '../GetConfiguredSyntaxHighlightingWorkerUrl/GetConfiguredSyntaxHighlightingWorkerUrl.ts'

export const syntaxHighlightingWorkerUrl =
  getConfiguredSyntaxHighlightingWorkerUrl() ||
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js`
