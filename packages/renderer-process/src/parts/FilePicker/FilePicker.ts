export const showDirectoryPicker = (options) => {
  // @ts-expect-error
  return window.showDirectoryPicker(options)
}

export const showFilePicker = (options) => {
  // @ts-expect-error
  return window.showOpenFilePicker(options)
}

export const showSaveFilePicker = (options) => {
  // @ts-expect-error
  return window.showSaveFilePicker(options)
}
