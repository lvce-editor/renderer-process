const createFileHandle = (file) => {
  return {
    getFile() {
      return file
    },
    kind: 'file',
    name: file.name,
    queryPermission() {
      return 'granted'
    },
    requestPermission() {
      return 'granted'
    },
  }
}

const getHandle = async (item) => {
  if (typeof item.getAsFileSystemHandle === 'function') {
    return item.getAsFileSystemHandle()
  }
  if (typeof item.getAsFile === 'function') {
    const file = item.getAsFile()
    if (file) {
      return createFileHandle(file)
    }
  }
  throw new TypeError('item.getAsFileSystemHandle is not a function')
}

export const getFileHandles = async (items) => {
  const itemsArray = [...items]
  const handles = await Promise.all(itemsArray.map(getHandle))
  return handles
}
