import * as Assert from '../Assert/Assert.ts'
import { IpcError } from '../IpcError/IpcError.ts'
import * as IsMessagePort from '../IsMessagePort/IsMessagePort.ts'
import * as Promises from '../Promises/Promises.ts'

export const create = async ({ url }) => {
  Assert.string(url)
  const { promise: portPromise, resolve } = Promises.withResolvers()
  Object.defineProperty(globalThis, 'acceptPort', {
    configurable: true,
    value: resolve,
  })
  try {
    await import(url)
    const port = await portPromise
    if (!port) {
      throw new IpcError('port must be defined')
    }
    if (!IsMessagePort.isMessagePort(port)) {
      throw new IpcError('port must be of type MessagePort')
    }
    return port
  } finally {
    delete globalThis.acceptPort
  }
}
