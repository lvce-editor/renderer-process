export const getConfiguredExtensionHostWorkerUrl = () => {
  if (typeof location === 'undefined' || typeof document === 'undefined') {
    return ''
  }
  const configElement = document.getElementById('Config')
  if (!configElement) {
    return ''
  }
  const text = configElement.textContent
  if (!text) {
    return ''
  }
  const config = JSON.parse(text)
  return config.extensionHostWorkerUrl || ''
}
