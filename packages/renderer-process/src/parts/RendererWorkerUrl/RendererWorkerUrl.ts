import * as AssetDir from '../AssetDir/AssetDir.ts'
import { getConfiguredRendererWorkerUrl } from '../GetConfiguredRendererWorkerUrl/GetConfiguredRendererWorkerUrl.ts'

export const rendererWorkerUrl = getConfiguredRendererWorkerUrl() || `${AssetDir.assetDir}/packages/renderer-worker/src/rendererWorkerMain.ts`
