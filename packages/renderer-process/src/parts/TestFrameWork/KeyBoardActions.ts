import * as ElementActions from './ElementActions.ts'

const keyCodeMap = {
  ' ': { code: 'Space', keyCode: 32 },
  '.': { code: 'Period', keyCode: 190 },
  '>': { code: 'Period', keyCode: 190, shiftKey: true },
  Enter: { code: 'Enter', keyCode: 13 },
  Space: { code: 'Space', key: ' ', keyCode: 32 },
}

const getKeyboardOptions = (options) => {
  const key = options.key || ''
  const normalizedKey = key === 'Space' ? ' ' : key
  if (keyCodeMap[key]) {
    const mapped = keyCodeMap[key]
    const keyCode = mapped.keyCode
    return {
      ...options,
      ...mapped,
      key: mapped.key || normalizedKey,
      which: keyCode,
    }
  }
  if (normalizedKey.length === 1) {
    const upper = normalizedKey.toUpperCase()
    const keyCode = upper.codePointAt(0)
    const code = /[A-Z]/.test(upper) ? `Key${upper}` : `Digit${upper}`
    return {
      ...options,
      code,
      key: normalizedKey,
      keyCode,
      which: keyCode,
    }
  }
  return options
}

const isXtermTextArea = (element: Element | null): element is HTMLTextAreaElement => {
  return element instanceof HTMLTextAreaElement && element.classList.contains('xterm-helper-textarea')
}

const getPrintableKey = (options) => {
  if (options.key === 'Space') {
    return ' '
  }
  if (options.key?.length === 1) {
    return options.key
  }
  return ''
}

export const press = (options) => {
  const element = document.activeElement
  if (!element) {
    return
  }
  const text = getPrintableKey(options)
  if (isXtermTextArea(element) && text) {
    element.value = text
    element.dispatchEvent(
      new InputEvent('input', {
        bubbles: true,
        cancelable: true,
        data: text,
        inputType: 'insertText',
      }),
    )
    element.value = ''
    return
  }
  const keyboardOptions = getKeyboardOptions(options)

  ElementActions.keyDown(element, keyboardOptions)
  ElementActions.keyUp(element, keyboardOptions)
}
