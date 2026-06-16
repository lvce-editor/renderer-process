import * as ClipboardDataType from '../ClipBoardDataType/ClipBoardDataType.ts'

export const getText = (clipBoardData) => {
  return clipBoardData.getData(ClipboardDataType.Text)
}
