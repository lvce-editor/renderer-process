import * as ClipBoard from './ClipBoard.ts'

export const name = 'ClipBoard'

export const Commands = {
  execCopy: ClipBoard.execCopy,
  read: ClipBoard.read,
  readText: ClipBoard.readText,
  write: ClipBoard.write,
  writeImage: ClipBoard.writeImage,
  writeText: ClipBoard.writeText,
}
