export const showDirectoryPicker = (options) => {
  // @ts-expect-error
  return window.showDirectoryPicker(options)
}

export const showFilePicker = (options) => {
  // @ts-expect-error
  if (typeof window.showOpenFilePicker === 'function') {
    // @ts-expect-error
    return window.showOpenFilePicker(options)
  }
  return showFilePickerFallback(options)
}

const showFilePickerFallback = (options) => {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = Boolean(options?.multiple)
  if (options?.accept) {
    input.accept = options.accept
  }
  document.body.append(input)
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      input.removeEventListener('change', onChange)
      input.removeEventListener('cancel', onCancel)
      input.remove()
    }
    const onChange = () => {
      const files = Array.from(input.files || [], (file) => ({
        file,
        kind: 'file',
        name: file.name,
        readonly: true,
      }))
      cleanup()
      resolve(files)
    }
    const onCancel = () => {
      cleanup()
      resolve([])
    }
    input.addEventListener('change', onChange, { once: true })
    input.addEventListener('cancel', onCancel, { once: true })
    try {
      input.click()
    } catch (error) {
      cleanup()
      reject(error instanceof Error ? error : new Error(String(error)))
    }
  })
}

export const showSaveFilePicker = (options) => {
  // @ts-expect-error
  return window.showSaveFilePicker(options)
}
