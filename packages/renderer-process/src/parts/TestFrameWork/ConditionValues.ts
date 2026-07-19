import * as GetParsedSelector from './GetParsedSelector.ts'
import * as QuerySelector from './QuerySelector.ts'

const getElementText = (locator) => {
  const parsedSelector = GetParsedSelector.getParsedSelector(locator)
  const element = QuerySelector.querySelectorOne(parsedSelector)
  if (!element) {
    return {
      actual: '',
      wasFound: false,
    }
  }
  return {
    actual: element.textContent,
    wasFound: true,
  }
}

export const toHaveText = (locator) => {
  return getElementText(locator)
}

export const toContainText = (locator) => {
  return getElementText(locator)
}

export const toHaveAttribute = (locator, { key, value }) => {
  const parsedSelector = GetParsedSelector.getParsedSelector(locator)
  const element = QuerySelector.querySelectorOne(parsedSelector)
  if (!element) {
    return {
      actual: '',
      wasFound: false,
    }
  }
  const actual = element.getAttribute(key)
  return {
    actual,
    wasFound: true,
  }
}

export const toHaveCount = (locator) => {
  const parsedSelector = GetParsedSelector.getParsedSelector(locator)
  const elements = QuerySelector.querySelector(parsedSelector)
  const actualCount = elements.length
  return {
    actual: actualCount,
  }
}

const stringifyElement = (element) => {
  if (element.id) {
    return `#${element.id}`
  }
  if (element.className) {
    return `.${element.className}`
  }
  if (element === document.body) {
    return 'document.body'
  }
  return element.tagName
}

export const toBeFocused = (locator) => {
  const activeElement = document.activeElement
  const stringifiedActiveElement = stringifyElement(activeElement)
  return {
    actual: stringifiedActiveElement,
  }
}

export const toHaveClass = (locator, { className }) => {
  const parsedSelector = GetParsedSelector.getParsedSelector(locator)
  const [element] = QuerySelector.querySelector(parsedSelector)
  if (!element) {
    return {
      actual: '',
      wasFound: false,
    }
  }
  return {
    actual: className,
    wasFound: true,
  }
}

export const toHaveId = (locator) => {
  const parsedSelector = GetParsedSelector.getParsedSelector(locator)
  const [element] = QuerySelector.querySelector(parsedSelector)
  if (!element) {
    return {
      actual: '',
      wasFound: false,
    }
  }
  return {
    actual: element.id,
    wasFound: true,
  }
}

export const toHaveCss = (locator, { key }) => {
  const parsedSelector = GetParsedSelector.getParsedSelector(locator)
  const [element] = QuerySelector.querySelector(parsedSelector)
  if (!element) {
    return {
      actual: '',
      wasFound: false,
    }
  }
  const style = getComputedStyle(element)
  const actual = style[key]
  return {
    actual,
    wasFound: true,
  }
}

export const toHaveJSProperty = (locator, { key }) => {
  const parsedSelector = GetParsedSelector.getParsedSelector(locator)
  const [element] = QuerySelector.querySelector(parsedSelector)
  if (!element) {
    return {
      actual: '',
      wasFound: false,
    }
  }
  const actual = element[key]
  return {
    actual,
    wasFound: true,
  }
}
