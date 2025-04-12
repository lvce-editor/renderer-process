const ipcs = Object.create(null)

export const set = (name: string, ipc: any): void => {
  ipcs[name] = ipc
}

export const get = (name: string) => {
  return ipcs[name]
}

export const remove = (name: string): void => {
  delete ipcs[name]
}

export const has = (name: string): boolean => {
  return ipcs[name]
}
