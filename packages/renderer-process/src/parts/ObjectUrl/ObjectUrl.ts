export const createObjectUrl = (blob: Blob): string => {
  return URL.createObjectURL(blob)
}

export const revokeObjectUrl = (url: string): void => {
  URL.revokeObjectURL(url)
}
