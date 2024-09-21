/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, test } from '@jest/globals'
import * as WebView from '../src/parts/WebView/WebView.ts'
import * as WebViewState from '../src/parts/WebViewState/WebViewState.ts'

const uid = 1

beforeEach(() => {
  WebViewState.remove(uid)
})

test('create', () => {
  const src = '/test/frame.html'
  const sandbox = []
  const csp = 'test-csp'
  const credentialless = true
  WebView.create(uid, src, sandbox, csp, credentialless)
  const $Iframe = WebViewState.get(uid)
  expect($Iframe.src).toBe('http://localhost/test/frame.html')
  // @ts-ignore
  expect($Iframe.csp).toBe('test-csp')
})

test('load', async () => {
  const $Iframe = document.createElement('iframe')
  WebViewState.set(uid, $Iframe)
  await WebView.load(uid)
})

test('setPort', async () => {
  // TODO
})
