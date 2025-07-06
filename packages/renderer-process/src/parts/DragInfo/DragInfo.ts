import { getDragInfo, setDragInfo } from '@lvce-editor/virtual-dom'

export const set = (id: string | number, data: string) => {
  setDragInfo(id, data)
}

export const get = (id: string | number) => {
  return getDragInfo(id)
}
