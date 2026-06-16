export const getIsFirefox = () => {
  if (typeof navigator === 'undefined') {
    return false
  }
  if (
    // @ts-expect-error
    globalThis.navigator.userAgentData?.brands
  ) {
    // @ts-expect-error
    return globalThis.navigator.userAgentData.brands.includes('Firefox')
  }
  return navigator.userAgent.toLowerCase().includes('firefox')
}
