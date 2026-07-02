export type SuccessResult<T> = {
  readonly ok: true
  readonly value: T
}

export type ErrorResult = {
  readonly ok: false
  readonly error: unknown
}

export type Result<T> = SuccessResult<T> | ErrorResult

export const success = <T>(value: T): SuccessResult<T> => {
  return {
    ok: true,
    value,
  }
}

export const error = (error: unknown): ErrorResult => {
  return {
    ok: false,
    error,
  }
}

export const isError = <T>(result: Result<T>): result is ErrorResult => {
  return !result.ok
}
