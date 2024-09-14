export const hasFlag = (key: string) => {
  if (typeof location === 'undefined' || typeof document === 'undefined') {
    return false
  }
  const configElement = document.getElementById('Config')
  if (!configElement) {
    return false
  }
  const text = configElement.textContent
  if (!text) {
    return false
  }
  const config = JSON.parse(text)
  return config[key]
}
