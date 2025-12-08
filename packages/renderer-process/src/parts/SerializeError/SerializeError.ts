import * as EnsureError from '../EnsureError/EnsureError.ts'

export const serializeError = (error) => {
  error = EnsureError.ensureError(error)
  return {
    codeFrame: error.codeFrame,
    message: error.message,
    name: error.name,
    stack: error.stack,
    type: error.constructor.name,
  }
}
