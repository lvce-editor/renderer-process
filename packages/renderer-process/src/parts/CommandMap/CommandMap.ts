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

export const commandMap = {
  'Audio.play': Audio.play,
  'ClipBoard.execCopy': ClipBoard.execCopy,
  'ClipBoard.readText': ClipBoard.readText,
  'ClipBoard.writeImage': ClipBoard.writeImage,
  'ClipBoard.writeText': ClipBoard.writeText,
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
  'InitData.getInitData': InitData.getInitData,
}
