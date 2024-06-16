import { expect, jest, test } from '@jest/globals'

jest.unstable_mockModule('../src/parts/IpcChild/IpcChild.ts', () => {
  return {
    listen: jest.fn(({ port }) => {
      return port
    }),
  }
})

jest.unstable_mockModule('../src/parts/HandleIpc/HandleIpc.ts', () => {
  return {
    handleIpc: jest.fn(),
  }
})

const IpcChild = await import('../src/parts/IpcChild/IpcChild.ts')
const HandleIpc = await import('../src/parts/HandleIpc/HandleIpc.ts')
const HandleMessagePort = await import('../src/parts/HandleMessagePort/HandleMessagePort.ts')

test('handleMessagePort', async () => {
  const messagePort = {} as MessagePort
  await HandleMessagePort.handleMessagePort(messagePort)
  expect(IpcChild.listen).toHaveBeenCalledTimes(1)
  expect(IpcChild.listen).toHaveBeenCalledWith({
    method: 1,
    port: messagePort,
  })
  expect(HandleIpc.handleIpc).toHaveBeenCalledTimes(1)
  expect(HandleIpc.handleIpc).toHaveBeenCalledWith(messagePort)
})
