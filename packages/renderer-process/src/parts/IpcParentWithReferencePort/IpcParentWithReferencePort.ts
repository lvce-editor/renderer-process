import * as Promises from '../Promises/Promises.ts'

export const create = async (url) => {
  const { promise, resolve } = Promises.withResolvers()
  Object.defineProperty(globalThis, 'acceptReferencePort', {
    configurable: true,
    value: resolve,
  })
  try {
    await import(url)
    return await promise
  } finally {
    delete globalThis.acceptReferencePort
  }
}
