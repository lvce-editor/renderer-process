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

export const commandMap = {
  'Audio.play': Audio.play,
  'ClipBoard.execCopy': ClipBoard.execCopy,
  'ClipBoard.readText': ClipBoard.readText,
  'ClipBoard.read': ClipBoard.read,
  'ClipBoard.writeImage': ClipBoard.writeImage,
  'ClipBoard.writeText': ClipBoard.writeText,
  'ClipBoard.write': ClipBoard.write,
  'ConfirmPrompt.prompt': ConfirmPrompt.prompt,
  'Css.addCssStyleSheet': Css.addCssStyleSheet,
  'Developer.showState': Developer.showState,
  'Download.downloadFile': Download.downloadFile,
  'FileHandles.get': FileHandles.get,
  'FilePicker.showDirectoryPicker': FilePicker.showDirectoryPicker,
  'FilePicker.showFilePicker': FilePicker.showFilePicker,
  'FilePicker.showSaveFilePicker': FilePicker.showSaveFilePicker,
  'FileSystemHandle.getFileHandles': FileSystemHandle.getFileHandles,
  'FileSystemHandle.requestPermission': FileSystemHandle.requestPermission,
  'FileSystemHandle.addFileHandle': FileSystemHandle.addFileHandle,
  'InitData.getInitData': InitData.getInitData,
  'IpcParent.create': IpcParent.create,
  'Layout.getBounds': Layout.getBounds,
  'Location.getHref': Location.getHref,
  'Location.getPathName': Location.getPathName,
  'Location.hydrate': Location.hydrate,
  'Location.setPathName': Location.setPathName,
  'MeasureTextHeight.measureTextHeight': MeasureTextHeight.measureTextHeight,
  'MeasureTextBlockHeight.measureTextBlockHeight': MeasureTextBlockHeight.measureTextBlockHeight,
  'Menu.focusIndex': Menu.focusIndex,
  'Menu.hide': Menu.hide,
  'Menu.hideSubMenu': Menu.hideSubMenu,
  'Menu.showControlled': Menu.showControlled,
  'Meta.setThemeColor': Meta.setThemeColor,
  'Notification.create': Notification.create,
  'Notification.createWithOptions': Notification.createWithOptions,
  'Notification.dispose': Notification.dispose,
  'OffscreenCanvas.create': OffscreenCanvas.create,
  'Open.openUrl': OpenUrl.openUrl,
  'Performance.getMemory': Performance.getMemory,
  'Performance.measureUserAgentSpecificMemory': Performance.measureUserAgentSpecificMemory,
  'Prompt.prompt': Prompt.prompt,
}
