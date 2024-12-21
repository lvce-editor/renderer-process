/**
 * @jest-environment jsdom
 */
import { beforeAll, beforeEach, expect, test } from '@jest/globals'
import * as WebView from '../src/parts/WebView/WebView.ts'
import * as WebViewState from '../src/parts/WebViewState/WebViewState.ts'

const uid = 1

beforeAll(() => {
  // @ts-ignore
  HTMLIFrameElement.prototype.sandbox = {
    __tokens: [],
    add(...tokens) {
      // @ts-ignore
      this.__tokens.push(...tokens)
    },
    contains(key) {
      // @ts-ignore
      return this.__tokens.includes(key)
    },
  }
})

beforeEach(() => {
  WebViewState.remove(uid)
})

test('create', () => {
  const src = '/test/frame.html'
  const sandbox = []
  const csp = 'test-csp'
  const credentialless = true
  const permissionPolicy = ''
  WebView.create(uid, src, sandbox, csp, credentialless, permissionPolicy)
  const $Iframe = WebViewState.get(uid)
  expect($Iframe.src).toBe('http://localhost/test/frame.html')
  // @ts-ignore
  expect($Iframe.csp).toBe('test-csp')
})

test('load', async () => {
  const $Workbench = document.createElement('div')
  $Workbench.id = 'Workbench'
  document.body.append($Workbench)
  const $Iframe = document.createElement('iframe')
  WebViewState.set(uid, $Iframe)
  await WebView.load(uid)
})

test('setPort', async () => {
  // TODO
})
