import * as ViewletModuleId from '../ViewletModuleId/ViewletModuleId.ts'

export const load = (moduleId) => {
  switch (moduleId) {
    case ViewletModuleId.ImagePreview:
      return import('../ImagePreview/ImagePreview.ts')
    case ViewletModuleId.ActivityBar:
      return import('../ViewletActivityBar/ViewletActivityBar.ts')
    case ViewletModuleId.Audio:
      return import('../ViewletAudio/ViewletAudio.ts')
    case ViewletModuleId.BrowserViewOverview:
      return import('../ViewletBrowseViewOverview/ViewletBrowserViewOverview.ts')
    case ViewletModuleId.Clock:
      return import('../ViewletClock/ViewletClock.ts')
    case ViewletModuleId.ColorPicker:
      return import('../ViewletColorPicker/ViewletColorPicker.ts')
    case ViewletModuleId.DebugConsole:
      return import('../ViewletDebugConsole/ViewletDebugConsole.ts')
    case ViewletModuleId.DefineKeyBinding:
      return import('../ViewletDefineKeyBinding/ViewletDefineKeyBinding.ts')
    case ViewletModuleId.Dialog:
      return import('../ViewletDialog/ViewletDialog.ts')
    case ViewletModuleId.DiffEditor:
      return import('../ViewletDiffEditor/ViewletDiffEditor.ts')
    case ViewletModuleId.EditorCompletion:
      return import('../ViewletEditorCompletion/ViewletEditorCompletion.ts')
    case ViewletModuleId.EditorError:
      return import('../ViewletEditorError/ViewletEditorError.ts')
    case ViewletModuleId.EditorHover:
      return import('../ViewletEditorHover/ViewletEditorHover.ts')
    case ViewletModuleId.EditorImage:
      return import('../ViewletEditorImage/ViewletEditorImage.ts')
    case ViewletModuleId.EditorPlainText:
      return import('../ViewletEditorPlainText/ViewletEditorPlainText.ts')
    case ViewletModuleId.EditorText:
      return import('../ViewletEditorText/ViewletEditorText.ts')
    case ViewletModuleId.EditorWidgetError:
      return import('../ViewletEditorWidgetError/ViewletEditorWidgetError.ts')
    case ViewletModuleId.Empty:
      return import('../ViewletEmpty/ViewletEmpty.ts')
    case ViewletModuleId.Error:
      return import('../ViewletError/ViewletError.ts')
    case ViewletModuleId.Explorer:
      return import('../ViewletExplorer/ViewletExplorer.ts')
    case ViewletModuleId.Extensions:
      return import('../ViewletExtensions/ViewletExtensions.ts')
    case ViewletModuleId.FindWidget:
      return import('../ViewletFindWidget/ViewletFindWidget.ts')
    case ViewletModuleId.Implementations:
      return import('../ViewletImplementations/ViewletImplementations.ts')
    case ViewletModuleId.KeyBindings:
      return import('../ViewletKeyBindings/ViewletKeyBindings.ts')
    case ViewletModuleId.Layout:
      return import('../ViewletLayout/ViewletLayout.ts')
    case ViewletModuleId.Main:
      return import('../ViewletMain/ViewletMain.ts')
    case ViewletModuleId.MainTabs:
      return import('../ViewletMainTabs/ViewletMainTabs.ts')
    case ViewletModuleId.Output:
      return import('../ViewletOutput/ViewletOutput.ts')
    case ViewletModuleId.Panel:
      return import('../ViewletPanel/ViewletPanel.ts')
    case ViewletModuleId.Problems:
      return import('../ViewletProblems/ViewletProblems.ts')
    case ViewletModuleId.QuickPick:
      return import('../ViewletQuickPick/ViewletQuickPick.ts')
    case ViewletModuleId.References:
      return import('../ViewletReferences/ViewletReferences.ts')
    case ViewletModuleId.RunAndDebug:
      return import('../ViewletRunAndDebug/ViewletRunAndDebug.ts')
    case ViewletModuleId.ScreenCapture:
      return import('../ViewletScreenCapture/ViewletScreenCapture.ts')
    case ViewletModuleId.SideBar:
      return import('../ViewletSideBar/ViewletSideBar.ts')
    case ViewletModuleId.SimpleBrowser:
      return import('../ViewletSimpleBrowser/ViewletSimpleBrowser.ts')
    case ViewletModuleId.SourceControl:
      return import('../ViewletSourceControl/ViewletSourceControl.ts')
    case ViewletModuleId.StatusBar:
      return import('../ViewletStatusBar/ViewletStatusBar.ts')
    case ViewletModuleId.Storage:
      return import('../ViewletStorage/ViewletStorage.ts')
    case ViewletModuleId.Terminal:
      return import('../ViewletTerminal/ViewletTerminal.ts')
    case ViewletModuleId.Terminals:
      return import('../ViewletTerminals/ViewletTerminals.ts')
    case ViewletModuleId.TitleBar:
      return import('../ViewletTitleBar/ViewletTitleBar.ts')
    case ViewletModuleId.TitleBarButtons:
      return import('../ViewletTitleBarButtons/ViewletTitleBarButtons.ts')
    case ViewletModuleId.TitleBarIcon:
      return import('../ViewletTitleBarIcon/ViewletTitleBarIcon.ts')
    case ViewletModuleId.TitleBarMenuBar:
      return import('../ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.ts')
    case ViewletModuleId.Video:
      return import('../ViewletVideo/ViewletVideo.ts')
    case ViewletModuleId.TitleBarTitle:
      return import('../ViewletTitleBarTitle/ViewletTitleBarTitle.ts')
    case ViewletModuleId.EditorSourceActions:
      return import('../ViewletEditorSourceActions/ViewletEditorSourceActions.ts')
    case ViewletModuleId.EmptyEditor:
      return import('../ViewletEmptyEditor/ViewletEmptyEditor.ts')
    case ViewletModuleId.InlineDiffEditor:
      return import('../ViewletInlineDiffEditor/ViewletInlineDiffEditor.ts')
    case ViewletModuleId.E2eTests:
      return import('../ViewletE2eTests/ViewletE2eTests.ts')
    case ViewletModuleId.E2eTest:
      return import('../ViewletE2eTest/ViewletE2eTest.ts')
    case ViewletModuleId.WebView:
      return import('../ViewletWebView/ViewletWebView.ts')
    case ViewletModuleId.EditorCompletionDetails:
      return import('../ViewletEditorCompletionDetails/ViewletEditorCompletionDetails.ts')
    case ViewletModuleId.EditorTextError:
      return import('../ViewletEditorTextError/ViewletEditorTextError.ts')
    case ViewletModuleId.EditorCodeGenerator:
      return import('../ViewletEditorCodeGenerator/ViewletEditorCodeGenerator.ts')
    default:
      throw new Error(`${moduleId} module not found in renderer process`)
  }
}
