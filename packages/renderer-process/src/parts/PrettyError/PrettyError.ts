import * as CleanStack from '../CleanStack/CleanStack.ts'
import * as IsActualSourceFile from '../IsActualSourceFile/IsActualSourceFile.ts'
import * as IsFirefox from '../IsFirefox/IsFirefox.ts'
import * as JoinLines from '../JoinLines/JoinLines.ts'
import * as Logger from '../Logger/Logger.ts'

const getErrorMessage = (error) => {
  if (!error) {
    return `Error: ${error}`
  }
  let message = error.message
  while (error.cause) {
    error = error.cause
    message += `: ${error}`
  }
  return message
}

const prepareErrorMessageWithCodeFrame = (error) => {
  if (!error) {
    return {
      _error: error,
      codeFrame: undefined,
      message: error,
      stack: undefined,
      type: 'Error',
    }
  }
  const message = getErrorMessage(error)
  const lines = CleanStack.cleanStack(error.stack)
  const relevantStack = JoinLines.joinLines(lines)
  if (error.codeFrame) {
    return {
      _error: error,
      codeFrame: error.codeFrame,
      message,
      stack: relevantStack,
      type: error.constructor.name,
    }
  }
  return {
    _error: error,
    category: error.category,
    codeFrame: error.originalCodeFrame,
    message,
    stack: error.originalStack,
    stderr: error.stderr,
  }
}

const RE_PATH_1 = /\(([^()]*):(\d+):(\d+)\)$/
const RE_PATH_2 = /at ([^\n]*):(\d+):(\d+)$/

const getFirefoxStackMatch = (line) => {
  const atIndex = line.indexOf('@')
  const columnIndex = line.lastIndexOf(':')
  const lineIndex = line.lastIndexOf(':', columnIndex - 1)
  if (atIndex === -1 || lineIndex <= atIndex || columnIndex <= lineIndex) {
    return undefined
  }
  const path = line.slice(atIndex + 1, lineIndex)
  const lineNumber = line.slice(lineIndex + 1, columnIndex)
  const column = line.slice(columnIndex + 1)
  if (!path || !lineNumber || !column) {
    return undefined
  }
  return [line, path, lineNumber, column]
}

/**
 *
 * @param {readonly string[]} lines
 * @returns
 */
const getFile = (lines) => {
  for (const line of lines) {
    if (RE_PATH_1.test(line) || RE_PATH_2.test(line) || getFirefoxStackMatch(line)) {
      return line
    }
  }
  return ''
}

const prepareErrorMessageWithoutCodeFrame = async (error) => {
  try {
    const lines = CleanStack.cleanStack(error.stack)
    const file = getFile(lines)
    let match = file.match(RE_PATH_1)
    if (!match) {
      match = file.match(RE_PATH_2)
    }
    if (!match) {
      match = getFirefoxStackMatch(file)
    }
    if (!match) {
      return error
    }
    const [_, path] = match
    if (!IsActualSourceFile.isActualSourceFile(path)) {
      return error
    }
    return {
      _error: error,
      message: error?.message || '',
      type: error.constructor.name,
    }
  } catch (otherError) {
    Logger.warn(`ErrorHandling Error: ${otherError}`)
    return error
  }
}

export const prepare = async (error) => {
  if (error && error.message && error.codeFrame) {
    return prepareErrorMessageWithCodeFrame(error)
  }
  if (error && error.stack) {
    return prepareErrorMessageWithoutCodeFrame(error)
  }
  return error
}

export const print = (error, prefix = '') => {
  if (IsFirefox.getIsFirefox()) {
    // Firefox does not support printing codeframe with error stack
    if (error && error._error) {
      Logger.error(`${prefix}${error._error}`)
      return
    }
    Logger.error(`${prefix}${error}`)
    return
  }
  if (error && error.type && error.message && error.codeFrame) {
    Logger.error(`${prefix}${error.type}: ${error.message}\n\n${error.codeFrame}\n\n${error.stack}`)
    return
  }
  if (error && error.message && error.codeFrame) {
    Logger.error(`${prefix}${error.message}\n\n${error.codeFrame}\n\n${error.stack}`)
    return
  }
  if (error && error.type && error.message) {
    Logger.error(`${prefix}${error.type}: ${error.message}\n${error.stack}`)
    return
  }
  if (error && error.stack) {
    Logger.error(`${prefix}${error.stack}`)
    return
  }
  if (error === null) {
    Logger.error(`${prefix}null`)
    return
  }
  Logger.error(`${prefix}${error}`)
}

export const getMessage = (error) => {
  if (error && error.type && error.message) {
    return `${error.type}: ${error.message}`
  }
  if (error && error.message) {
    return `${error.constructor.name}: ${error.message}`
  }
  return `Error: ${error}`
}
