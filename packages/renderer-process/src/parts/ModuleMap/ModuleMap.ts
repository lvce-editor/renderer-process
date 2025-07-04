import { CommandNotFoundError } from '../CommandNotFoundError/CommandNotFoundError.ts'
import * as ModuleId from '../ModuleId/ModuleId.ts'

export const getModuleId = (commandId) => {
  switch (commandId) {
    case 'Audio.play':
      return ModuleId.Audio
    case 'ClipBoard.execCopy':
    case 'ClipBoard.readText':
    case 'ClipBoard.writeImage':
    case 'ClipBoard.writeText':
    case 'ClipBoard.write':
    case 'ClipBoard.read':
      return ModuleId.ClipBoard
    case 'FileHandles.get':
      return ModuleId.FileHandles
    case 'ConfirmPrompt.prompt':
      return ModuleId.ConfirmPrompt
    case 'Css.addCssStyleSheet':
      return ModuleId.Css
    case 'Developer.getMemoryUsage':
    case 'Developer.showState':
      return ModuleId.Developer
    case 'Download.downloadFile':
      return ModuleId.Download
    case 764:
    case 765:
    case 766:
    case 767:
    case 768:
    case 769:
    case 770:
    case 771:
    case 772:
    case 773:
    case 774:
    case 775:
    case 776:
    case 777:
      return ModuleId.EditorController
    case 'EditorError.create':
      return ModuleId.EditorError
    case 'EditorHover.create':
      return ModuleId.EditorHover
    case 'FilePicker.showDirectoryPicker':
    case 'FilePicker.showFilePicker':
    case 'FilePicker.showSaveFilePicker':
      return ModuleId.FilePicker
    case 'FileSystemHandle.requestPermission':
    case 'FileSystemHandle.requestPermission':
    case 'FileSystemHandle.addFileHandle':
      return ModuleId.FileSystemHandle
    case 'ImagePreview.create':
    case 'ImagePreview.dispose':
    case 'ImagePreview.showError':
    case 'ImagePreview.update':
      return ModuleId.ImagePreview
    case 'InitData.getInitData':
      return ModuleId.InitData
    case 'IpcParent.create':
      return ModuleId.IpcParent
    case 'Layout.getBounds':
    case 'Layout.hide':
    case 'Layout.hydrate':
    case 'Layout.show':
    case 'Layout.update':
      return ModuleId.Layout
    case 'Location.getHref':
    case 'Location.getPathName':
    case 'Location.hydrate':
    case 'Location.setPathName':
      return ModuleId.Location
    case 'MeasureTextHeight.measureTextHeight':
      return ModuleId.MeasureTextHeight
    case 'MeasureTextBlockHeight.measureTextBlockHeight':
      return ModuleId.MeasureTextBlockHeight
    case 'Menu.focusIndex':
    case 'Menu.hide':
    case 'Menu.hideSubMenu':
    case 'Menu.show':
    case 'Menu.showContextMenu':
    case 'Menu.showControlled':
    case 'Menu.showMenu':
    case 'Menu.showSubMenu':
      return ModuleId.Menu
    case 'Meta.setThemeColor':
      return ModuleId.Meta
    case 'Notification.create':
    case 'Notification.createWithOptions':
    case 'Notification.dispose':
      return ModuleId.Notification
    case 'OffscreenCanvas.create':
      return ModuleId.OffscreenCanvas
    case 'Open.openUrl':
      return ModuleId.Open
    case 6661:
    case 6662:
    case 6663:
    case 6664:
      return ModuleId.Panel
    case 'Performance.getMemory':
    case 'Performance.measureUserAgentSpecificMemory':
      return ModuleId.Performance
    case 'Prompt.prompt':
      return ModuleId.Prompt
    case 'SanitizeHtml.sanitizeHtml':
      return ModuleId.SanitizeHtml
    case 'ScreenCapture.start':
      return ModuleId.ScreenCapture
    case 'TestFrameWork.checkMultiElementCondition':
    case 'TestFrameWork.checkSingleElementCondition':
    case 'TestFrameWork.performAction':
    case 'TestFrameWork.performKeyBoardAction':
    case 'TestFrameWork.showOverlay':
    case 'TestFrameWork.conditionToHaveText':
    case 'TestFrameWork.conditionToHaveAttribute':
    case 'TestFrameWork.conditionToHaveCount':
    case 'TestFrameWork.conditionToBeFocused':
    case 'TestFrameWork.conditionToHaveClass':
    case 'TestFrameWork.conditionToHaveId':
      return ModuleId.TestFrameWork
    case 'Transferrable.transfer':
    case 'Transferrable.transferToWebView':
      return ModuleId.Transferrable
    case 'Viewlet.appendViewlet':
    case 'Viewlet.dispose':
    case 'Viewlet.focus':
    case 'Viewlet.focusBody':
    case 'Viewlet.handleError':
    case 'Viewlet.invoke':
    case 'Viewlet.load':
    case 'Viewlet.loadModule':
    case 'Viewlet.refresh':
    case 'Viewlet.send':
    case 'Viewlet.sendMultiple':
    case 'Viewlet.setBounds':
    case 'Viewlet.registerEventListeners':
      return ModuleId.Viewlet
    case 549:
    case 550:
    case 551:
      return ModuleId.ViewService
    case 'WebStorage.clear':
    case 'WebStorage.getItem':
    case 'WebStorage.setItem':
      return ModuleId.WebStorage
    case 'Window.close':
    case 'Window.maximize':
    case 'Window.minimize':
    case 'Window.onVisibilityChange':
    case 'Window.reload':
    case 'Window.unmaximize':
      return ModuleId.Window
    case 33_111:
      return ModuleId.Workbench
    case 'WindowTitle.set':
      return ModuleId.WindowTitle
    case 'KeyBindings.setIdentifiers':
      return ModuleId.KeyBindings
    case 'PointerCapture.mock':
    case 'PointerCapture.unmock':
      return ModuleId.PointerCapture
    case 'GetFilePathElectron.getFilePathElectron':
      return ModuleId.GetFilePathElectron
    case 'HandleMessagePort.handleMessagePort':
      return ModuleId.HandleMessagePort
    case 'WebView.create':
    case 'WebView.load':
    case 'WebView.loadOnly':
    case 'WebView.appendOnly':
    case 'WebView.setPort':
    case 'WebView.dispose':
      return ModuleId.WebView
    default:
      throw new CommandNotFoundError(commandId)
  }
}
