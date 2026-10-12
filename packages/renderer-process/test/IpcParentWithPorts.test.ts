import { afterEach, expect, test } from '@jest/globals'
import * as IpcParentWithMessagePort from '../src/parts/IpcParentWithMessagePort/IpcParentWithMessagePort.ts'
import * as IpcParentWithReferencePort from '../src/parts/IpcParentWithReferencePort/IpcParentWithReferencePort.ts'

const globalState = globalThis as typeof globalThis & {
  testMessagePort?: MessagePort
  testReferencePort?: object
}

afterEach(() => {
  delete globalState.testMessagePort
  delete globalState.testReferencePort
})

test('message port is accepted after importing its child module', async () => {
  const channel = new MessageChannel()
  globalState.testMessagePort = channel.port2
  try {
    const url = `data:text/javascript,globalThis.acceptPort(globalThis.testMessagePort)`
    await expect(IpcParentWithMessagePort.create({ url })).resolves.toBe(channel.port2)
    expect(globalThis.acceptPort).toBeUndefined()
  } finally {
    channel.port1.close()
    channel.port2.close()
  }
})

test('reference port is accepted after importing its child module', async () => {
  const referencePort = {}
  globalState.testReferencePort = referencePort
  const url = `data:text/javascript,globalThis.acceptReferencePort(globalThis.testReferencePort)`

  await expect(IpcParentWithReferencePort.create(url)).resolves.toBe(referencePort)
  expect(globalThis.acceptReferencePort).toBeUndefined()
})
