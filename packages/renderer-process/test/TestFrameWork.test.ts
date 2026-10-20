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
  document.body.append(input)
  const events: Event[] = []
  input.addEventListener('input', (event) => {
    events.push(event)
  })

  ElementActions.type(input, { text: 'hello' })

  expect(document.activeElement).toBe(input)
  expect(input.value).toBe('hello')
  expect(events).toHaveLength(1)
  expect(events[0]).toBeInstanceOf(InputEvent)
})

test.each([
  ['a', 'a'],
  ['Backspace', '\u{7F}'],
  ['Enter', '\r'],
  ['Escape', '\u{1B}'],
  ['Space', ' '],
  ['Tab', '\t'],
])('keyboard action sends %s to a focused xterm textarea', (key, expectedData) => {
  const textArea = document.createElement('textarea')
  textArea.className = 'xterm-helper-textarea'
  document.body.append(textArea)
  textArea.focus()
  const data: Array<string | null> = []
  textArea.addEventListener('input', (event) => {
    data.push(event.data)
  })

  TestFrameWork.performKeyboardAction('press', {
    altKey: false,
    ctrlKey: false,
    key,
    shiftKey: false,
  })

  expect(data).toEqual([expectedData])
  expect(textArea.value).toBe('')
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

test('checkSingleElementCondition waits for a matching element', async () => {
  const parsedSelector = [
    {
      selector: '.target',
      type: 'css' as const,
    },
  ]
  setTimeout(() => {
    document.body.innerHTML = '<button class="target">Save</button>'
  })

  await expect(TestFrameWork.checkSingleElementCondition(parsedSelector, 'toHaveText', { text: 'Save' })).resolves.toEqual({ error: false })
})

test('checkMultiElementCondition waits for matching elements', async () => {
  const parsedSelector = [
    {
      selector: '.target',
      type: 'css' as const,
    },
  ]
  setTimeout(() => {
    document.body.innerHTML = '<div class="target"></div><div class="target"></div>'
  })

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

test('numeric condition IDs check elements and retrieve failure details', async () => {
  document.body.innerHTML = '<button class="target">Save</button>'
  const selector = [{ selector: '.target', type: 'css' as const }]
  await expect(TestFrameWork.checkSingleElementCondition(selector, 11, { text: 'Save' })).resolves.toEqual({ error: false })
  await expect(TestFrameWork.checkMultiElementCondition(selector, 7, { count: 1 })).resolves.toEqual({ error: false })
  expect(await TestFrameWork.checkConditionError(11, selector)).toEqual({ actual: 'Save', wasFound: true })
  document.body.replaceChildren()
  expect(await TestFrameWork.checkConditionError(11, selector)).toEqual({ actual: '', wasFound: false })
})

test('screenshot matcher reports a missing element and fixture URI', async () => {
  await expect(TestFrameWork.toMatchScreenShot({ _parsed: [{ selector: '.missing', type: 'css' }] }, 'about.svg')).rejects.toThrow(
    '[SCREENSHOT_ELEMENT_NOT_FOUND]',
  )
})

test('screenshot matcher forwards the exact resolved element and releases it on failure', async () => {
  const host = globalThis as typeof globalThis & {
    lvceMatchScreenshot?: (uri: string, token: string) => Promise<void>
    lvceScreenshotTargets?: Map<string, Element>
  }
  const button = document.createElement('button')
  button.textContent = 'About'
  document.body.append(button)
  let captured: Element | undefined
  host.lvceMatchScreenshot = async (uri, token) => {
    expect(uri).toBe('about.svg')
    captured = host.lvceScreenshotTargets?.get(token)
    throw new Error('SVG screenshot differs: about.svg')
  }
  try {
    await expect(TestFrameWork.toMatchScreenShot([{ text: 'About', type: 'text' }], 'about.svg')).rejects.toThrow('SVG screenshot differs: about.svg')
    expect(captured).toBe(button)
    expect(host.lvceScreenshotTargets?.size).toBe(0)
  } finally {
    delete host.lvceMatchScreenshot
    delete host.lvceScreenshotTargets
  }
})

test('screenshot matcher explains when the runner bridge is unavailable', async () => {
  document.body.append(document.createElement('button'))
  await expect(TestFrameWork.toMatchScreenShot([{ selector: 'button', type: 'css' }], 'about.svg')).rejects.toThrow('[SCREENSHOT_RUNNER_UNAVAILABLE]')
})
