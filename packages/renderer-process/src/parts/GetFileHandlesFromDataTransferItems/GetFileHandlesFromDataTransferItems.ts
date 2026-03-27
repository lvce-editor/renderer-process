import * as IsFileSystemAccessNotSupportedOnFireFoxError from '../IsFileSystemAccessNotSupportedOnFireFoxError/IsFileSystemAccessNotSupportedOnFirefoxError.ts'

const getFileHandleModern = async (item) => {
  return item.getAsFileSystemHandle()
}

const getFileHandlesModern = async (items) => {
  const itemsArray = [...items]
  const handles = await Promise.all(itemsArray.map(getFileHandleModern))
  return handles
}

const getFileLegacy = (item) => {
  if (typeof item.getAsFile === 'function') {
    const file = item.getAsFile()
    if (file) {
      return file
    }
  }
  throw new TypeError('item.getAsFileSystemHandle is not a function')
}

const getFileHandlesLegacy = (items) => {
  const itemsArray = [...items]
  const files = itemsArray.map(getFileLegacy)
  return files
}

export const getFileHandles = async (items) => {
  try {
    return await getFileHandlesModern(items)
  } catch {
    return getFileHandlesLegacy(items)
  }
}
