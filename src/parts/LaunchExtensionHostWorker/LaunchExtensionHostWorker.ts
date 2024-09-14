import * as ExtensionHostWorkerUrl from '../ExtensionHostWorkerUrl/ExtensionHostWorkerUrl.ts'
import * as LaunchWorker from '../LaunchWorker/LaunchWorker.ts'

export const launchExtensionHostWorker = async () => {
  return LaunchWorker.launchWorker({
    name: 'Extension Host Worker',
    url: ExtensionHostWorkerUrl.extensionHostWorkerUrl,
  })
}
