import { htmlElements } from './HtmlElements.ts'
import type { ParsedCssSelector } from './ParsedCssSelector.ts'

const querySelectorByText = (root, text) => {
  let node
  const elements = []
  const walk = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null)
  while ((node = walk.nextNode())) {
    if (node.nodeValue === text) {
      // @ts-expect-error
      elements.push(node.parentNode)
    }
  }
  return elements
}

const querySelectorByCss = (selector) => {
  // @ts-ignore
  return [...document.querySelectorAll(selector)]
}

const isElement = (selector) => {
  return htmlElements.includes(selector)
}

const selectorToString = (parsedSelector: ParsedCssSelector) => {
  if (parsedSelector.type === 'text') {
    return `text=${parsedSelector.text}`
  }
  if (parsedSelector.type === 'css+text') {
    return `${parsedSelector.selector} text=${parsedSelector.text}`
  }
  return parsedSelector.selector
}

const queryCssSelector = (selector: string) => {
  if (selector.startsWith('.')) {
    return querySelectorByCss(selector)
  }
  if (selector.startsWith('#')) {
    return querySelectorByCss(selector)
  }
  if (
    selector.startsWith('[data') ||
    selector.startsWith('[title') ||
    selector.startsWith('[name') ||
    selector.startsWith('[aria-label') ||
    selector.startsWith('[role')
  ) {
    return querySelectorByCss(selector)
  }
  if (isElement(selector)) {
    return querySelectorByCss(selector)
  }
  throw new Error(`unsupported selector: ${selector}`)
}

export const querySelector = (parsedSelector: ParsedCssSelector) => {
  if (!parsedSelector || typeof parsedSelector !== 'object' || Array.isArray(parsedSelector)) {
    throw new TypeError('parsedSelector must be of type object')
  }
  if (parsedSelector.type === 'text') {
    return querySelectorByText(document.body, parsedSelector.text)
  }
  if (parsedSelector.type === 'css+text') {
    const elements = queryCssSelector(parsedSelector.selector)
    return elements.flatMap((element) => {
      return querySelectorByText(element, parsedSelector.text)
    })
  }
  if (parsedSelector.type === 'css') {
    return queryCssSelector(parsedSelector.selector)
  }
  throw new Error(`unsupported selector: ${selectorToString(parsedSelector)}`)
}

export const querySelectorWithOptions = (parsedSelector: ParsedCssSelector, { hasText = '', nth = -1 } = {}) => {
  let elements = querySelector(parsedSelector)
  if (hasText) {
    elements = elements.filter((element) => element.textContent === hasText)
  }
  if (elements.length === 0) {
    return undefined
  }
  if (elements.length === 1) {
    const element = elements[0]
    return element
  }
  if (nth === -1) {
    throw new Error(`too many matching elements for ${selectorToString(parsedSelector)}, matching ${elements.length}`)
  }
  const element = elements[nth]
  if (!element) {
    throw new Error(`selector not found: ${selectorToString(parsedSelector)}`)
  }
  return element
}
