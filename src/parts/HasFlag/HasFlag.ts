export const hasFlag = (key: string) => {
  if (typeof location === 'undefined') {
    return false
  }
  const params = new URLSearchParams(location.search)
  return params.has(key)
}
