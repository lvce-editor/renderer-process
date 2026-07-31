import { getDragInfo, setDragInfo } from '@lvce-editor/virtual-dom'

const state: { currentDragInfo: any } = {
  currentDragInfo: undefined,
}

export const set = (id: string | number, data: any) => {
  state.currentDragInfo = data
  setDragInfo(id, data)
}

export const get = (id: string | number) => {
  return getDragInfo(id)
}

export const getCurrent = (): any => {
  return state.currentDragInfo
}
