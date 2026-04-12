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

const querySelectorByCssFromRoot = (root, selector) => {
  if (root === document.body) {
    return querySelectorByCss(selector)
  }
  // @ts-ignore
  return [...root.querySelectorAll(selector)]
}

const selectorToString = (parsedSelector: ParsedCssSelector) => {
  let result = ''
  for (const part of parsedSelector) {
    if (part.type === 'css') {
      if (!result) {
        result = part.selector
        continue
      }
      result = `${result} >> ${part.selector}`
      continue
    }
    if (part.type === 'text') {
      if (!result) {
        result = `text=${part.text}`
        continue
      }
      result = `${result} text=${part.text}`
      continue
    }
    if (part.type === 'has-text') {
      result = `${result} "${part.text}"`
      continue
    }
    result = `${result}:nth(${part.index})`
  }
  return result
}

export const querySelector = (parsedSelector: ParsedCssSelector) => {
  if (!Array.isArray(parsedSelector)) {
    throw new TypeError('parsedSelector must be of type array')
  }
  let elements = [document.body]
  for (const part of parsedSelector) {
    if (part.type === 'text') {
      elements = elements.flatMap((element) => {
        return querySelectorByText(element, part.text)
      })
      continue
    }
    if (part.type === 'css') {
      elements = elements.flatMap((element) => {
        return querySelectorByCssFromRoot(element, part.selector)
      })
      continue
    }
    if (part.type === 'has-text') {
      elements = elements.filter((element) => element.textContent === part.text)
      continue
    }
    if (part.type === 'nth') {
      const element = elements[part.index]
      elements = element ? [element] : []
      continue
    }
    throw new Error(`unsupported selector: ${selectorToString(parsedSelector)}`)
  }
  return elements
}

export const querySelectorOne = (parsedSelector: ParsedCssSelector) => {
  const elements = querySelector(parsedSelector)
  if (elements.length === 0) {
    return undefined
  }
  if (elements.length === 1) {
    const element = elements[0]
    return element
  }
  throw new Error(`too many matching elements for ${selectorToString(parsedSelector)}, matching ${elements.length}`)
}
