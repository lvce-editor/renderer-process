import * as ClipboardDataType from '../ClipBoardDataType/ClipBoardDataType.ts'

export const getText = (clipboardData) => {
  return clipboardData.getData(ClipboardDataType.Text)
}
