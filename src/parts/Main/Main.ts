import * as Command from '../Command/Command.ts'
import * as LaunchWorkers from '../LaunchWorkers/LaunchWorkers.ts'
import * as Module from '../Module/Module.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as ViewletColorPicker from '../ViewletColorPicker/ViewletColorPicker.ts'
import * as ViewletEditorCodeGenerator from '../ViewletEditorCodeGenerator/ViewletEditorCodeGenerator.ts'
import * as ViewletEditorCompletion from '../ViewletEditorCompletion/ViewletEditorCompletion.ts'
import * as ViewletEditorCompletionDetails from '../ViewletEditorCompletionDetails/ViewletEditorCompletionDetails.ts'
import * as ViewletEditorHover from '../ViewletEditorHover/ViewletEditorHover.ts'
import * as ViewletEditorRename from '../ViewletEditorRename/ViewletEditorRename.ts'
import * as ViewletEditorSourceActions from '../ViewletEditorSourceActions/ViewletEditorSourceActions.ts'
import * as ViewletFindWidget from '../ViewletFindWidget/ViewletFindWidget.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'
import * as ViewletState from '../ViewletState/ViewletState.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'
import * as WindowListeners from '../WindowListeners/WindowListeners.ts'

export const main = async () => {
  WindowListeners.enable(window)
  ViewletState.state.modules[ViewletModuleId.ColorPicker] = ViewletColorPicker
  ViewletState.state.modules[ViewletModuleId.EditorCodeGenerator] = ViewletEditorCodeGenerator
  ViewletState.state.modules[ViewletModuleId.EditorCompletion] = ViewletEditorCompletion
  ViewletState.state.modules[ViewletModuleId.EditorCompletionDetails] = ViewletEditorCompletionDetails
  ViewletState.state.modules[ViewletModuleId.EditorHover] = ViewletEditorHover
  ViewletState.state.modules[ViewletModuleId.EditorRename] = ViewletEditorRename
  ViewletState.state.modules[ViewletModuleId.EditorSourceActions] = ViewletEditorSourceActions
  ViewletState.state.modules[ViewletModuleId.FindWidget] = ViewletFindWidget
  Command.setLoad(Module.load)
  // TODO this is discovered very late
  await LaunchWorkers.launchWorkers()
  VirtualDom.setIpc(RendererWorker)
}
