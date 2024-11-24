const dragInfos = Object.create(null)

export const set = (id: string, data: string) => {
  dragInfos[id] = data
}

export const get = (id: string) => {
  return dragInfos[id]
}
