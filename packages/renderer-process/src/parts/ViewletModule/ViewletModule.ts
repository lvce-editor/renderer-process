import * as ImagePreview from '../ImagePreview/ImagePreview.ts'
import * as ViewletActivityBar from '../ViewletActivityBar/ViewletActivityBar.ts'
import * as ViewletAudio from '../ViewletAudio/ViewletAudio.ts'
import * as ViewletClock from '../ViewletClock/ViewletClock.ts'
import * as ViewletColorPicker from '../ViewletColorPicker/ViewletColorPicker.ts'
import * as ViewletDebugConsole from '../ViewletDebugConsole/ViewletDebugConsole.ts'
import * as ViewletDefineKeyBinding from '../ViewletDefineKeyBinding/ViewletDefineKeyBinding.ts'
import * as ViewletDialog from '../ViewletDialog/ViewletDialog.ts'
import * as ViewletDiffEditor from '../ViewletDiffEditor/ViewletDiffEditor.ts'
import * as ViewletE2eTest from '../ViewletE2eTest/ViewletE2eTest.ts'
import * as ViewletE2eTests from '../ViewletE2eTests/ViewletE2eTests.ts'
import * as ViewletEditorCodeGenerator from '../ViewletEditorCodeGenerator/ViewletEditorCodeGenerator.ts'
import * as ViewletEditorCompletion from '../ViewletEditorCompletion/ViewletEditorCompletion.ts'
import * as ViewletEditorCompletionDetails from '../ViewletEditorCompletionDetails/ViewletEditorCompletionDetails.ts'
import * as ViewletEditorError from '../ViewletEditorError/ViewletEditorError.ts'
import * as ViewletEditorHover from '../ViewletEditorHover/ViewletEditorHover.ts'
import * as ViewletEditorImage from '../ViewletEditorImage/ViewletEditorImage.ts'
import * as ViewletEditorPlainText from '../ViewletEditorPlainText/ViewletEditorPlainText.ts'
import * as ViewletEditorSourceActions from '../ViewletEditorSourceActions/ViewletEditorSourceActions.ts'
import * as ViewletEditorTextError from '../ViewletEditorTextError/ViewletEditorTextError.ts'
import * as ViewletEditorWidgetError from '../ViewletEditorWidgetError/ViewletEditorWidgetError.ts'
import * as ViewletEmpty from '../ViewletEmpty/ViewletEmpty.ts'
import * as ViewletEmptyEditor from '../ViewletEmptyEditor/ViewletEmptyEditor.ts'
import * as ViewletError from '../ViewletError/ViewletError.ts'
import * as ViewletExtensionView from '../ViewletExtensionView/ViewletExtensionView.ts'
import * as ViewletFindWidget from '../ViewletFindWidget/ViewletFindWidget.ts'
import * as ViewletImplementations from '../ViewletImplementations/ViewletImplementations.ts'
import * as ViewletInlineDiffEditor from '../ViewletInlineDiffEditor/ViewletInlineDiffEditor.ts'
import * as ViewletKeyBindings from '../ViewletKeyBindings/ViewletKeyBindings.ts'
import * as ViewletLayout from '../ViewletLayout/ViewletLayout.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'
import * as ViewletOutput from '../ViewletOutput/ViewletOutput.ts'
import * as ViewletPanel from '../ViewletPanel/ViewletPanel.ts'
import * as ViewletReferences from '../ViewletReferences/ViewletReferences.ts'
import * as ViewletRunAndDebug from '../ViewletRunAndDebug/ViewletRunAndDebug.ts'
import * as ViewletScreenCapture from '../ViewletScreenCapture/ViewletScreenCapture.ts'
import * as ViewletSidebar from '../ViewletSideBar/ViewletSideBar.ts'
import * as ViewletSimpleBrowser from '../ViewletSimpleBrowser/ViewletSimpleBrowser.ts'
import * as ViewletSourceControl from '../ViewletSourceControl/ViewletSourceControl.ts'
import * as ViewletStatusBar from '../ViewletStatusBar/ViewletStatusBar.ts'
import * as ViewletStorage from '../ViewletStorage/ViewletStorage.ts'
import * as ViewletTerminals from '../ViewletTerminals/ViewletTerminals.ts'
import * as ViewletTitleBar from '../ViewletTitleBar/ViewletTitleBar.ts'
import * as ViewletTitleBarButtons from '../ViewletTitleBarButtons/ViewletTitleBarButtons.ts'
import * as ViewletTitleBarIcon from '../ViewletTitleBarIcon/ViewletTitleBarIcon.ts'
import * as ViewletTitleBarMenuBar from '../ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.ts'
import * as ViewletTitleBarTitle from '../ViewletTitleBarTitle/ViewletTitleBarTitle.ts'
import * as ViewletVideo from '../ViewletVideo/ViewletVideo.ts'
import * as ViewletWebView from '../ViewletWebView/ViewletWebView.ts'

const moduleLoaders = {
  [ViewletModuleId.ActivityBar]: () => ViewletActivityBar,
  [ViewletModuleId.Audio]: () => ViewletAudio,
  [ViewletModuleId.Clock]: () => ViewletClock,
  [ViewletModuleId.ColorPicker]: () => ViewletColorPicker,
  [ViewletModuleId.DebugConsole]: () => ViewletDebugConsole,
  [ViewletModuleId.DefineKeyBinding]: () => ViewletDefineKeyBinding,
  [ViewletModuleId.Dialog]: () => ViewletDialog,
  [ViewletModuleId.DiffEditor]: () => ViewletDiffEditor,
  [ViewletModuleId.E2eTest]: () => ViewletE2eTest,
  [ViewletModuleId.E2eTests]: () => ViewletE2eTests,
  [ViewletModuleId.EditorCodeGenerator]: () => ViewletEditorCodeGenerator,
  [ViewletModuleId.EditorCompletion]: () => ViewletEditorCompletion,
  [ViewletModuleId.EditorCompletionDetails]: () => ViewletEditorCompletionDetails,
  [ViewletModuleId.EditorError]: () => ViewletEditorError,
  [ViewletModuleId.EditorHover]: () => ViewletEditorHover,
  [ViewletModuleId.EditorImage]: () => ViewletEditorImage,
  [ViewletModuleId.EditorPlainText]: () => ViewletEditorPlainText,
  [ViewletModuleId.EditorSourceActions]: () => ViewletEditorSourceActions,
  [ViewletModuleId.EditorTextError]: () => ViewletEditorTextError,
  [ViewletModuleId.EditorWidgetError]: () => ViewletEditorWidgetError,
  [ViewletModuleId.Empty]: () => ViewletEmpty,
  [ViewletModuleId.EmptyEditor]: () => ViewletEmptyEditor,
  [ViewletModuleId.Error]: () => ViewletError,
  [ViewletModuleId.ExtensionView]: () => ViewletExtensionView,
  [ViewletModuleId.FindWidget]: () => ViewletFindWidget,
  [ViewletModuleId.ImagePreview]: () => ImagePreview,
  [ViewletModuleId.Implementations]: () => ViewletImplementations,
  [ViewletModuleId.InlineDiffEditor]: () => ViewletInlineDiffEditor,
  [ViewletModuleId.KeyBindings]: () => ViewletKeyBindings,
  [ViewletModuleId.Layout]: () => ViewletLayout,
  [ViewletModuleId.Output]: () => ViewletOutput,
  [ViewletModuleId.Panel]: () => ViewletPanel,
  [ViewletModuleId.References]: () => ViewletReferences,
  [ViewletModuleId.RunAndDebug]: () => ViewletRunAndDebug,
  [ViewletModuleId.ScreenCapture]: () => ViewletScreenCapture,
  [ViewletModuleId.Sidebar]: () => ViewletSidebar,
  [ViewletModuleId.SimpleBrowser]: () => ViewletSimpleBrowser,
  [ViewletModuleId.SourceControl]: () => ViewletSourceControl,
  [ViewletModuleId.StatusBar]: () => ViewletStatusBar,
  [ViewletModuleId.Storage]: () => ViewletStorage,
  [ViewletModuleId.Terminal]: () => import('../ViewletTerminal/ViewletTerminal.ts'),
  [ViewletModuleId.Terminal2]: () => import('../ViewletTerminal2/ViewletTerminal2.ts'),
  [ViewletModuleId.Terminals]: () => ViewletTerminals,
  [ViewletModuleId.TitleBar]: () => ViewletTitleBar,
  [ViewletModuleId.TitleBarButtons]: () => ViewletTitleBarButtons,
  [ViewletModuleId.TitleBarIcon]: () => ViewletTitleBarIcon,
  [ViewletModuleId.TitleBarMenuBar]: () => ViewletTitleBarMenuBar,
  [ViewletModuleId.TitleBarTitle]: () => ViewletTitleBarTitle,
  [ViewletModuleId.Video]: () => ViewletVideo,
  [ViewletModuleId.WebView]: () => ViewletWebView,
}

export const load = (moduleId) => {
  const loadModule = moduleLoaders[moduleId]
  if (!loadModule) {
    throw new Error(`${moduleId} module not found in renderer process`)
  }
  return loadModule()
}
