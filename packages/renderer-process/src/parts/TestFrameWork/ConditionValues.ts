import * as QuerySelector from './QuerySelector.ts'

export const toHaveText = (locator) => {
  const element = QuerySelector.querySelectorWithOptions(locator._selector, {
    nth: locator._nth,
    hasText: locator._hasText,
  })
  if (!element) {
    return {
      wasFound: false,
      actual: '',
    }
  }
  return {
    wasFound: true,
    actual: element.textContent,
  }
}

export const toHaveAttribute = (locator, { key, value }) => {
  const element = QuerySelector.querySelectorWithOptions(locator._selector, {
    nth: locator._nth,
    hasText: locator._hasText,
  })
  if (!element) {
    return {
      wasFound: false,
      actual: '',
    }
  }
  const actual = element.getAttribute(key)
  return {
    wasFound: false,
    actual,
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
      wasFound: false,
      actual: '',
    }
  }
  return {
    wasFound: true,
    actual: className,
  }
}

export const toHaveId = (locator) => {
  const [element] = QuerySelector.querySelector(locator._selector)
  if (!element) {
    return {
      wasFound: false,
      actual: '',
    }
  }
  return {
    wasFound: true,
    actual: element.id,
  }
}

export const toHaveCss = (locator, { key }) => {
  const [element] = QuerySelector.querySelector(locator._selector)
  if (!element) {
    return {
      wasFound: false,
      actual: '',
    }
  }
  const style = getComputedStyle(element)
  const actual = style[key]
  return {
    wasFound: true,
    actual,
  }
}
