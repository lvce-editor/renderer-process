import * as Command from '../Command/Command.ts'
import * as HandleBeforeInstallPrompt from '../HandleBeforeInstallPrompt/HandleBeforeInstallPrompt.ts'
import * as LaunchWorkers from '../LaunchWorkers/LaunchWorkers.ts'
import * as Module from '../Module/Module.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as ViewletEditorCompletion from '../ViewletEditorCompletion/ViewletEditorCompletion.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'
import * as ViewletState from '../ViewletState/ViewletState.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as WindowListeners from '../WindowListeners/WindowListeners.ts'

export const main = async () => {
  WindowListeners.enable(window)
  ViewletState.state.modules[ViewletModuleId.EditorCompletion] = ViewletEditorCompletion
  Command.setLoad(Module.load)
  if (Platform.platform === PlatformType.Web) {
    // disable prompt to download app as pwa
    // @ts-expect-error
    window.onbeforeinstallprompt = HandleBeforeInstallPrompt.handleBeforeInstallPrompt
  }
  // TODO this is discovered very late
  await LaunchWorkers.launchWorkers()
  VirtualDom.setIpc(RendererWorker)
}
