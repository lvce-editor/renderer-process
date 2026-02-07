import * as Audio from '../Audio/Audio.ts'
import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt.ts'
import * as Css from '../Css/Css.ts'
import * as Developer from '../Developer/Developer.ts'
import * as Download from '../Download/Download.ts'
import * as FileHandles from '../FileHandles/FileHandles.ts'
import * as FilePicker from '../FilePicker/FilePicker.ts'
import * as FileSystemHandle from '../FileSystemHandle/FileSystemHandle.ts'
import * as InitData from '../InitData/InitData.ts'
import * as IpcParent from '../IpcParent/IpcParent.ts'
import * as Layout from '../Layout/Layout.ts'
import * as Location from '../Location/Location.ts'
import * as MeasureTextBlockHeight from '../MeasureTextBlockHeight/MeasureTextBlockHeight.ts'
import * as MeasureTextHeight from '../MeasureTextHeight/MeasureTextHeight.ts'
import * as Meta from '../Meta/Meta.ts'
import * as Notification from '../Notification/Notification.ts'
import * as OffscreenCanvas from '../OffscreenCanvas/OffscreenCanvas.ts'
import * as Menu from '../OldMenu/Menu.ts'
import * as OpenUrl from '../Open/Open.ts'
import * as Performance from '../Performance/Performance.ts'
import * as Prompt from '../Prompt/Prompt.ts'
import * as ScreenCapture from '../ScreenCapture/ScreenCapture.ts'
import * as TestFrameWork from '../TestFrameWork/TestFrameWork.ts'
import * as Transferrable from '../Transferrable/Transferrable.ts'
import * as Viewlet from '../Viewlet/Viewlet.ts'
import * as WebStorage from '../WebStorage/WebStorage.ts'
import * as Window from '../Window/Window.ts'
import * as WindowTitle from '../WindowTitle/WindowTitle.ts'
import * as KeyBindings from '../KeyBindings/KeyBindings.ts'
import * as PointerCapture from '../PointerCapture/PointerCapture.ts'
import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.ts'
import * as HandleMessagePort from '../HandleMessagePort/HandleMessagePort.ts'
import * as WebView from '../WebView/WebView.ts'

export const commandMap = {
  'Audio.play': Audio.play,
  'ClipBoard.execCopy': ClipBoard.execCopy,
  'ClipBoard.read': ClipBoard.read,
  'ClipBoard.readText': ClipBoard.readText,
  'ClipBoard.write': ClipBoard.write,
  'ClipBoard.writeImage': ClipBoard.writeImage,
  'ClipBoard.writeText': ClipBoard.writeText,
  'ConfirmPrompt.prompt': ConfirmPrompt.confirm,
  'Css.addCssStyleSheet': Css.addCssStyleSheet,
  'Css.getSelectionText': Css.getSelectionText,
  'Developer.showState': Developer.showState,
  'Download.downloadFile': Download.downloadFile,
  'FileHandles.get': FileHandles.get,
  'FilePicker.showDirectoryPicker': FilePicker.showDirectoryPicker,
  'FilePicker.showFilePicker': FilePicker.showFilePicker,
  'FilePicker.showSaveFilePicker': FilePicker.showSaveFilePicker,
  'FileSystemHandle.addFileHandle': FileSystemHandle.addFileHandle,
  'FileSystemHandle.getFileHandles': FileSystemHandle.getFileHandles,
  'FileSystemHandle.requestPermission': FileSystemHandle.requestPermission,
  'GetFilePathElectron.getFilePathElectron': GetFilePathElectron.getFilePathElectron,
  'HandleMessagePort.handleMessagePort': HandleMessagePort.handleMessagePort,
  'InitData.getInitData': InitData.getInitData,
  'IpcParent.create': IpcParent.create,
  'KeyBindings.setIdentifiers': KeyBindings.setIdentifiers,
  'Layout.getBounds': Layout.getBounds,
  'Location.getHref': Location.getHref,
  'Location.getPathName': Location.getPathName,
  'Location.hydrate': Location.hydrate,
  'Location.setPathName': Location.setPathName,
  'MeasureTextBlockHeight.measureTextBlockHeight': MeasureTextBlockHeight.measureTextBlockHeight,
  'MeasureTextHeight.measureTextHeight': MeasureTextHeight.measureTextHeight,
  'Menu.focusIndex': Menu.focusIndex,
  'Menu.hide': Menu.hide,
  'Menu.hideSubMenu': Menu.hideSubMenu,
  'Menu.showControlled': Menu.showControlled,
  'Menu.showMenu': Menu.showMenu,
  'Meta.setThemeColor': Meta.setThemeColor,
  'Notification.create': Notification.create,
  'Notification.createWithOptions': Notification.createWithOptions,
  'Notification.dispose': Notification.dispose,
  'OffscreenCanvas.create': OffscreenCanvas.create,
  'OffscreenCanvas.create2': OffscreenCanvas.create2,
  'Open.openUrl': OpenUrl.openUrl,
  'Performance.getMemory': Performance.getMemory,
  'Performance.measureUserAgentSpecificMemory': Performance.measureUserAgentSpecificMemory,
  'PointerCapture.mock': PointerCapture.mock,
  'PointerCapture.unmock': PointerCapture.unmock,
  'Prompt.prompt': Prompt.prompt,
  'ScreenCapture.start': ScreenCapture.start,
  'TestFrameWork.checkConditionError': TestFrameWork.checkConditionError,
  'TestFrameWork.checkMultiElementCondition': TestFrameWork.checkMultiElementCondition,
  'TestFrameWork.checkSingleElementCondition': TestFrameWork.checkSingleElementCondition,
  'TestFrameWork.performAction': TestFrameWork.performAction,
  'TestFrameWork.performAction2': TestFrameWork.performAction2,
  'TestFrameWork.performKeyBoardAction': TestFrameWork.performKeyBoardAction,
  'TestFrameWork.showOverlay': TestFrameWork.showOverlay,
  'TestFrameWork.transfer': Transferrable.transfer,
  'TestFrameWork.transferToWebView': Transferrable.transferToWebView,
  'Viewlet.addKeyBindings': Viewlet.addKeyBindings,
  'Viewlet.appendViewlet': Viewlet.appendViewlet,
  'Viewlet.dispose': Viewlet.dispose,
  'Viewlet.executeCommands': Viewlet.executeCommands,
  'Viewlet.focus': Viewlet.focus,
  'Viewlet.focusElementByName': Viewlet.focusElementByName,
  'Viewlet.focusSelector': Viewlet.focusSelector,
  'Viewlet.handleError': Viewlet.handleError,
  'Viewlet.invoke': Viewlet.invoke,
  'Viewlet.loadModule': Viewlet.loadModule,
  'Viewlet.refresh': Viewlet.refresh,
  'Viewlet.registerEventListeners': Viewlet.registerEventListeners,
  'Viewlet.removeKeyBindings': Viewlet.removeKeyBindings,
  'Viewlet.send': Viewlet.invoke,
  'Viewlet.sendMultiple': Viewlet.sendMultiple,
  'Viewlet.setBounds': Viewlet.setBounds,
  'Viewlet.show': Viewlet.show,
  'WebStorage.clear': WebStorage.clear,
  'WebStorage.getItem': WebStorage.getItem,
  'WebStorage.setItem': WebStorage.setItem,
  'WebStorage.setJsonObjects': WebStorage.setJsonObjects,
  'WebView.appendOnly': WebView.appendOnly,
  'WebView.create': WebView.create,
  'WebView.dispose': WebView.dispose,
  'WebView.load': WebView.load,
  'WebView.loadOnly': WebView.loadOnly,
  'WebView.setPort': WebView.setPort,
  'Window.close': Window.close,
  'Window.maximize': Window.maximize,
  'Window.minimize': Window.minimize,
  'Window.onVisibilityChange': Window.onVisibilityChange,
  'Window.reload': Window.reload,
  'Window.unmaximize': Window.unmaximize,
  'WindowTitle.set': WindowTitle.set,
}
