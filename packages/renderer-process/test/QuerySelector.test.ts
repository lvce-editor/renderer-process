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

test('querySelector supports numeric css, text, hasText and nth steps', () => {
  document.body.innerHTML = '<section><button>alpha</button><button>beta</button><button>beta</button></section>'
  expect(
    QuerySelector.querySelector([
      { selector: 'section', type: 1 },
      { text: 'beta', type: 2 },
    ]),
  ).toHaveLength(2)
  const result = QuerySelector.querySelectorOne([
    { selector: 'button', type: 1 },
    { text: 'beta', type: 3 },
    { index: 1, type: 4 },
  ])
  expect(result).toBe(document.querySelectorAll('button')[2])
  expect(
    QuerySelector.querySelector([
      { selector: 'button', type: 1 },
      { index: 9, type: 4 },
    ]),
  ).toEqual([])
})

test('querySelectorOne prints numeric selectors in errors', () => {
  document.body.innerHTML = '<section><button>beta</button><button>beta</button></section>'
  expect(() =>
    QuerySelector.querySelectorOne([
      { selector: 'section', type: 1 },
      { selector: 'button', type: 1 },
      { text: 'beta', type: 2 },
      { text: 'beta', type: 3 },
    ]),
  ).toThrow('too many matching elements for section >> button text=beta "beta", matching 2')
})
