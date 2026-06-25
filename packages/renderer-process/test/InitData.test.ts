/**
 * @jest-environment jsdom
 */
import { afterEach, expect, test } from '@jest/globals'

const InitData = await import('../src/parts/InitData/InitData.ts')

afterEach(() => {
  document.body.replaceChildren()
  document.head.replaceChildren()
})

test('getInitData includes config from html', () => {
  const config = document.createElement('script')
  config.id = 'Config'
  config.type = 'application/json'
  config.textContent = JSON.stringify({
    argv: ['--link', 'file:///test/packages/editor-worker/dist/editorWorkerMain.js'],
    editorWorkerUrl: '/remote/test/packages/editor-worker/dist/editorWorkerMain.js',
  })
  document.head.append(config)

  const initData = InitData.getInitData()

  expect(initData.Config).toMatchObject({
    argv: ['--link', 'file:///test/packages/editor-worker/dist/editorWorkerMain.js'],
    editorWorkerUrl: '/remote/test/packages/editor-worker/dist/editorWorkerMain.js',
  })
})

test('getInitData works without html config', () => {
  const initData = InitData.getInitData()

  expect(initData.Config).toEqual({
    shouldLaunchMultipleWorkers: expect.any(Boolean),
  })
})
