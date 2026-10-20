import { expect, test } from '@jest/globals'
import { restoreJsonRpcError } from '@lvce-editor/json-rpc'
import { PlainMessagePortRpc } from '@lvce-editor/rpc'
import { MessageChannel } from 'node:worker_threads'

test('preserves binary read errors across renderer RPC boundaries', async () => {
  const error = { data: { name: 'BinaryFileError', type: 'Error' }, message: 'Cannot open binary file' }
  expect(restoreJsonRpcError(error).name).toBe('BinaryFileError')
  const { port1, port2 } = new MessageChannel()
  try {
    port2.on('message', (request) => port2.postMessage({ error, id: request.id, jsonrpc: '2.0' }))
    const rpc = await PlainMessagePortRpc.create({ commandMap: {}, messagePort: port1 as unknown as MessagePort })
    await expect(rpc.invoke('FileSystem.readFile')).rejects.toMatchObject({ message: 'Cannot open binary file', name: 'BinaryFileError' })
  } finally {
    port1.close()
    port2.close()
  }
})
