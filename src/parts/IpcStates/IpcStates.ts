const ipcs = Object.create(null)

export const set = (name: string, ipc: any) => {
  ipcs[name] = ipc
}

export const get = (name: string) => {
  return ipcs[name]
}

export const has = (name: string) => {
  return ipcs[name]
}
