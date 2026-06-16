import * as Clipboard_ from './ClipBoard.ts'

export const name = 'ClipBoard'

export const Commands = {
  execCopy: Clipboard_.execCopy,
  read: Clipboard_.read,
  readText: Clipboard_.readText,
  write: Clipboard_.write,
  writeImage: Clipboard_.writeImage,
  writeText: Clipboard_.writeText,
}
