export const normalizeKey = (key: string, code: string): string => {
  if (key.length === 1) {
    return key.toLowerCase()
  }
  if (key === 'Unidentified') {
    return code
  }
  return key
}
