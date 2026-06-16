export const isChromeExtensionError = (error) => {
  return String(error) === 'Script error.'
}
