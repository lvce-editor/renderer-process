/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, test } from '@jest/globals'
import * as TestFrameWork from '../src/parts/TestFrameWork/TestFrameWork.ts'

beforeEach(() => {
  document.body.replaceChildren()
})

test('showTestResults appends hidden results element', () => {
  TestFrameWork.showTestResults('[{"name":"sample.js","status":"pass","error":"","start":0,"end":1}]')

  const element = document.querySelector<HTMLElement>('.TestResults')
  expect(element).toBeInstanceOf(HTMLDivElement)
  expect(element?.hidden).toBe(true)
  expect(element?.textContent).toBe('[{"name":"sample.js","status":"pass","error":"","start":0,"end":1}]')
})

test('showTestResults updates existing results element', () => {
  TestFrameWork.showTestResults('[]')
  TestFrameWork.showTestResults('[{"name":"sample.js","status":"fail","error":"x","start":0,"end":1}]')

  const elements = document.querySelectorAll('.TestResults')
  expect(elements).toHaveLength(1)
  expect(elements[0]?.textContent).toBe('[{"name":"sample.js","status":"fail","error":"x","start":0,"end":1}]')
})
