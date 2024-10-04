import * as AssetDir from '../AssetDir/AssetDir.ts'
import * as GetConfiguredExtensionHostWorkerUrl from '../GetConfiguredExtensionHostWorkerUrl/GetConfiguredExtensionHostWorkerUrl.ts'

export const extensionHostWorkerUrl =
  GetConfiguredExtensionHostWorkerUrl.getConfiguredExtensionHostWorkerUrl() ||
  `${AssetDir.assetDir}/packages/renderer-worker/node_modules/@lvce-editor/extension-host-worker/dist/extensionHostWorkerMain.js`
