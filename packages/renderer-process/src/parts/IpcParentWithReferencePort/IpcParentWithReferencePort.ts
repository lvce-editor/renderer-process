export const create = async (url) => {
  const referencePort = await new Promise((resolve) => {
    Object.defineProperty(globalThis, 'acceptReferencePort', {
      configurable: true,
      value: resolve,
    })
    import(url)
  })
  delete globalThis.acceptReferencePort
  return referencePort
}
