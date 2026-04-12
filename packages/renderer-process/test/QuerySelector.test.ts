/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as QuerySelector from '../src/parts/TestFrameWork/QuerySelector.ts'

test('querySelector finds css selector from parsed selector', () => {
  document.body.innerHTML = '<div class="target"></div>'
  const result = QuerySelector.querySelector([
    {
      selector: '.target',
      type: 'css',
    },
  ])
  expect(result).toHaveLength(1)
  expect(result[0]?.className).toBe('target')
})

test('querySelector finds text selector from parsed selector', () => {
  document.body.innerHTML = '<div>alpha</div><div>beta</div>'
  const result = QuerySelector.querySelector([
    {
      text: 'beta',
      type: 'text',
    },
  ])
  expect(result).toHaveLength(1)
  expect(result[0]?.textContent).toBe('beta')
})

test('querySelector finds css+text selector from parsed selector', () => {
  document.body.innerHTML = '<div><span>alpha</span></div><div class="target"><span>beta</span></div>'
  const result = QuerySelector.querySelector([
    {
      selector: '.target',
      type: 'css',
    },
    {
      text: 'beta',
      type: 'text',
    },
  ])
  expect(result).toHaveLength(1)
  expect(result[0]?.textContent).toBe('beta')
})

test('querySelector finds compound css selector from parsed selector', () => {
  document.body.innerHTML = '<button><span>alpha</span></button><button><span>beta</span></button>'
  const result = QuerySelector.querySelector([
    {
      selector: 'button span',
      type: 'css',
    },
  ])
  expect(result).toHaveLength(2)
  expect(result[1]?.textContent).toBe('beta')
})

test('querySelector filters by hasText and nth steps', () => {
  document.body.innerHTML = '<button>alpha</button><button>beta</button><button>beta</button>'
  const result = QuerySelector.querySelectorOne([
    {
      selector: 'button',
      type: 'css',
    },
    {
      text: 'beta',
      type: 'has-text',
    },
    {
      index: 1,
      type: 'nth',
    },
  ])
  expect(result?.textContent).toBe('beta')
})

test('querySelectorOne throws for too many matching elements without nth', () => {
  document.body.innerHTML = '<button>alpha</button><button>beta</button>'
  expect(() =>
    QuerySelector.querySelectorOne([
      {
        selector: 'button',
        type: 'css',
      },
    ]),
  ).toThrow(new Error('too many matching elements for button, matching 2'))
})
