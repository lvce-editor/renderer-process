/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as RendererWorkerTrace from '../src/parts/RendererWorkerTrace/RendererWorkerTrace.ts'

beforeEach(() => {
  document.body.replaceChildren()
  RendererWorkerTrace.initialize('')
})

test('does not export a trace by default', () => {
  RendererWorkerTrace.record('sent', 'Viewlet.show', [1])
  RendererWorkerTrace.exportToDom()

  expect(document.querySelector('.RendererWorkerTrace')).toBeNull()
})

test('exports sent and received renderer worker commands as json', () => {
  RendererWorkerTrace.initialize('?traceRendererWorker=true')
  const ipc = new EventTarget() as EventTarget & {
    getData: (event: MessageEvent) => unknown
  }
  ipc.getData = (event): unknown => event.data
  RendererWorkerTrace.listen({
    dispose: jest.fn(async () => {}),
    invoke: jest.fn(async () => {}),
    invokeAndTransfer: jest.fn(async () => {}),
    // @ts-expect-error The production rpc exposes its ipc connection at runtime.
    ipc,
    send: jest.fn(),
  })

  RendererWorkerTrace.record('sent', 'Layout.handleResize', [800, 600])
  ipc.dispatchEvent(
    new MessageEvent('message', {
      data: {
        method: 'Viewlet.executeCommands',
        params: [1, ['div']],
      },
    }),
  )
  RendererWorkerTrace.exportToDom()

  const script = document.querySelector<HTMLScriptElement>('script.RendererWorkerTrace')
  expect(script?.type).toBe('application/json')
  expect(JSON.parse(script?.textContent || '')).toEqual({
    entries: [
      {
        direction: 'sent',
        method: 'Layout.handleResize',
        params: [800, 600],
        timestamp: expect.any(Number),
      },
      {
        direction: 'received',
        method: 'Viewlet.executeCommands',
        params: [1, ['div']],
        timestamp: expect.any(Number),
      },
    ],
    version: 1,
  })
})

test('serializes transferables without including their bytes', () => {
  RendererWorkerTrace.initialize('?traceRendererWorker=true')
  RendererWorkerTrace.record('sent', 'Transferrable.transfer', [new Uint8Array(1024)])
  RendererWorkerTrace.exportToDom()

  const script = document.querySelector<HTMLScriptElement>('script.RendererWorkerTrace')
  const trace = JSON.parse(script?.textContent || '')
  expect(trace.entries[0].params).toEqual([
    {
      byteLength: 1024,
      type: 'Uint8Array',
    },
  ])
})
