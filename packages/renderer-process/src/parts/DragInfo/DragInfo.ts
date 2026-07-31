import { getDragInfo, setDragInfo } from '@lvce-editor/virtual-dom'

let currentDragInfo: any

export const set = (id: string | number, data: any) => {
  currentDragInfo = data
  setDragInfo(id, data)
}

export const get = (id: string | number) => {
  return getDragInfo(id)
}

export const getCurrent = (): any => {
  return currentDragInfo
}
