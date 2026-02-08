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
import * as ViewletEditorText from '../ViewletEditorText/ViewletEditorText.ts'
import * as ViewletEditorTextError from '../ViewletEditorTextError/ViewletEditorTextError.ts'
import * as ViewletEditorWidgetError from '../ViewletEditorWidgetError/ViewletEditorWidgetError.ts'
import * as ViewletEmpty from '../ViewletEmpty/ViewletEmpty.ts'
import * as ViewletEmptyEditor from '../ViewletEmptyEditor/ViewletEmptyEditor.ts'
import * as ViewletError from '../ViewletError/ViewletError.ts'
import * as ViewletFindWidget from '../ViewletFindWidget/ViewletFindWidget.ts'
import * as ViewletImplementations from '../ViewletImplementations/ViewletImplementations.ts'
import * as ViewletInlineDiffEditor from '../ViewletInlineDiffEditor/ViewletInlineDiffEditor.ts'
import * as ViewletKeyBindings from '../ViewletKeyBindings/ViewletKeyBindings.ts'
import * as ViewletLayout from '../ViewletLayout/ViewletLayout.ts'
import * as ViewletMain from '../ViewletMain/ViewletMain.ts'
import * as ViewletMainTabs from '../ViewletMainTabs/ViewletMainTabs.ts'
import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'
import * as ViewletOutput from '../ViewletOutput/ViewletOutput.ts'
import * as ViewletPanel from '../ViewletPanel/ViewletPanel.ts'
import * as ViewletReferences from '../ViewletReferences/ViewletReferences.ts'
import * as ViewletRunAndDebug from '../ViewletRunAndDebug/ViewletRunAndDebug.ts'
import * as ViewletScreenCapture from '../ViewletScreenCapture/ViewletScreenCapture.ts'
import * as ViewletSideBar from '../ViewletSideBar/ViewletSideBar.ts'
import * as ViewletSimpleBrowser from '../ViewletSimpleBrowser/ViewletSimpleBrowser.ts'
import * as ViewletSourceControl from '../ViewletSourceControl/ViewletSourceControl.ts'
import * as ViewletStatusBar from '../ViewletStatusBar/ViewletStatusBar.ts'
import * as ViewletStorage from '../ViewletStorage/ViewletStorage.ts'
import * as ViewletTerminals from '../ViewletTerminals/ViewletTerminals.ts'
import * as ViewletVideo from '../ViewletVideo/ViewletVideo.ts'
import * as ViewletWebView from '../ViewletWebView/ViewletWebView.ts'

export const load = (moduleId) => {
  switch (moduleId) {
    case ViewletModuleId.ActivityBar:
      return ViewletActivityBar
    case ViewletModuleId.Audio:
      return ViewletAudio
    case ViewletModuleId.Clock:
      return ViewletClock
    case ViewletModuleId.ColorPicker:
      return ViewletColorPicker
    case ViewletModuleId.DebugConsole:
      return ViewletDebugConsole
    case ViewletModuleId.DefineKeyBinding:
      return ViewletDefineKeyBinding
    case ViewletModuleId.Dialog:
      return ViewletDialog
    case ViewletModuleId.DiffEditor:
      return ViewletDiffEditor
    case ViewletModuleId.E2eTest:
      return ViewletE2eTest
    case ViewletModuleId.E2eTests:
      return ViewletE2eTests
    case ViewletModuleId.EditorCodeGenerator:
      return ViewletEditorCodeGenerator
    case ViewletModuleId.EditorCompletion:
      return ViewletEditorCompletion
    case ViewletModuleId.EditorCompletionDetails:
      return ViewletEditorCompletionDetails
    case ViewletModuleId.EditorError:
      return ViewletEditorError
    case ViewletModuleId.EditorHover:
      return ViewletEditorHover
    case ViewletModuleId.EditorImage:
      return ViewletEditorImage
    case ViewletModuleId.EditorPlainText:
      return ViewletEditorPlainText
    case ViewletModuleId.EditorSourceActions:
      return ViewletEditorSourceActions
    case ViewletModuleId.EditorText:
      return ViewletEditorText
    case ViewletModuleId.EditorTextError:
      return ViewletEditorTextError
    case ViewletModuleId.EditorWidgetError:
      return ViewletEditorWidgetError
    case ViewletModuleId.Empty:
      return ViewletEmpty
    case ViewletModuleId.EmptyEditor:
      return ViewletEmptyEditor
    case ViewletModuleId.Error:
      return ViewletError
    case ViewletModuleId.FindWidget:
      return ViewletFindWidget
    case ViewletModuleId.ImagePreview:
      return ImagePreview
    case ViewletModuleId.Implementations:
      return ViewletImplementations
    case ViewletModuleId.InlineDiffEditor:
      return ViewletInlineDiffEditor
    case ViewletModuleId.KeyBindings:
      return ViewletKeyBindings
    case ViewletModuleId.Layout:
      return ViewletLayout
    case ViewletModuleId.Main:
      return ViewletMain
    case ViewletModuleId.MainTabs:
      return ViewletMainTabs
    case ViewletModuleId.Output:
      return ViewletOutput
    case ViewletModuleId.Panel:
      return ViewletPanel
    case ViewletModuleId.References:
      return ViewletReferences
    case ViewletModuleId.RunAndDebug:
      return ViewletRunAndDebug
    case ViewletModuleId.ScreenCapture:
      return ViewletScreenCapture
    case ViewletModuleId.SideBar:
      return ViewletSideBar
    case ViewletModuleId.SimpleBrowser:
      return ViewletSimpleBrowser
    case ViewletModuleId.SourceControl:
      return ViewletSourceControl
    case ViewletModuleId.StatusBar:
      return ViewletStatusBar
    case ViewletModuleId.Storage:
      return ViewletStorage
    case ViewletModuleId.Terminal:
      return import('../ViewletTerminal/ViewletTerminal.ts')
    case ViewletModuleId.Terminals:
      return ViewletTerminals
    case ViewletModuleId.Video:
      return ViewletVideo
    case ViewletModuleId.WebView:
      return ViewletWebView
    default:
      throw new Error(`${moduleId} module not found in renderer process`)
  }
}
