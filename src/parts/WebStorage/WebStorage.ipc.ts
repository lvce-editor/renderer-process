import * as WebStorage from './WebStorage.ts'

export const name = 'WebStorage'

export const Commands = {
  clear: WebStorage.clear,
  getAll: WebStorage.getAll,
  getItem: WebStorage.getItem,
  setItem: WebStorage.setItem,
  setJsonObjects: WebStorage.setJsonObjects,
}
