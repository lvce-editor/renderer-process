export const getConfiguredWorkerUrl = (key) => {
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
  if (key === 'workerUrls') {
    return config.workerUrls || {}
  }
  return config[key] || ''
}
