/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, test } from '@jest/globals'
import * as ElementActions from '../src/parts/TestFrameWork/ElementActions.ts'
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

test('type dispatches input event', () => {
  const input = document.createElement('input')
  const events: Event[] = []
  input.addEventListener('input', (event) => {
    events.push(event)
  })

  ElementActions.type(input, { text: 'hello' })

  expect(input.value).toBe('hello')
  expect(events).toHaveLength(1)
  expect(events[0]).toBeInstanceOf(InputEvent)
})

test('checkSingleElementCondition accepts a compact parsed selector', async () => {
  document.body.innerHTML = '<main><button>Save</button><button>Save</button></main>'
  const parsedSelector = [
    {
      selector: 'main',
      type: 'css' as const,
    },
    {
      selector: 'button',
      type: 'css' as const,
    },
    {
      text: 'Save',
      type: 'has-text' as const,
    },
    {
      index: 0,
      type: 'nth' as const,
    },
  ]

  await expect(TestFrameWork.checkSingleElementCondition(parsedSelector, 'toHaveText', { text: 'Save' })).resolves.toEqual({ error: false })
})

test('checkMultiElementCondition accepts a compact parsed selector', async () => {
  document.body.innerHTML = '<main><div class="item"></div><div class="item"></div></main>'
  const parsedSelector = [
    {
      selector: 'main',
      type: 'css' as const,
    },
    {
      selector: '.item',
      type: 'css' as const,
    },
  ]

  await expect(TestFrameWork.checkMultiElementCondition(parsedSelector, 'toHaveCount', { count: 2 })).resolves.toEqual({ error: false })
})

test('condition checks continue to accept a legacy locator', async () => {
  document.body.innerHTML = '<button class="target">Save</button>'
  const parsedSelector = [
    {
      selector: '.target',
      type: 'css' as const,
    },
  ]
  const locator = {
    _parsed: parsedSelector,
    _selector: '.target',
  }

  await expect(TestFrameWork.checkSingleElementCondition(locator, 'toBeVisible', {})).resolves.toEqual({ error: false })
  await expect(TestFrameWork.checkMultiElementCondition(locator, 'toHaveCount', { count: 1 })).resolves.toEqual({ error: false })
})

test('condition error values accept compact and legacy locators', async () => {
  document.body.innerHTML = '<button class="target">Save</button>'
  const parsedSelector = [
    {
      selector: '.target',
      type: 'css' as const,
    },
  ]

  expect(await TestFrameWork.checkConditionError('toHaveText', parsedSelector)).toEqual({
    actual: 'Save',
    wasFound: true,
  })
  expect(
    await TestFrameWork.checkConditionError('toHaveText', {
      _parsed: parsedSelector,
      _selector: '.target',
    }),
  ).toEqual({
    actual: 'Save',
    wasFound: true,
  })
})
