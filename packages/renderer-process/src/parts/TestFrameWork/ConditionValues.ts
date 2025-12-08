import * as QuerySelector from './QuerySelector.ts'

export const toHaveText = (locator) => {
  const element = QuerySelector.querySelectorWithOptions(locator._selector, {
    hasText: locator._hasText,
    nth: locator._nth,
  })
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

export const toHaveAttribute = (locator, { key, value }) => {
  const element = QuerySelector.querySelectorWithOptions(locator._selector, {
    hasText: locator._hasText,
    nth: locator._nth,
  })
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
  const elements = QuerySelector.querySelector(locator._selector)
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
  const [element] = QuerySelector.querySelector(locator._selector)
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
  const [element] = QuerySelector.querySelector(locator._selector)
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
  const [element] = QuerySelector.querySelector(locator._selector)
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
  const [element] = QuerySelector.querySelector(locator._selector)
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
