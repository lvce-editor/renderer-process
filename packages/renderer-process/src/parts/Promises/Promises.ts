export const withResolvers = <T = unknown>() => {
  /**
   * @type {any}
   */
  let _resolve
  /**
   * @type {any}
   */
  let _reject
  const promise = new Promise<T>((resolve, reject) => {
    _resolve = resolve
    _reject = reject
  })
  return {
    promise,
    reject: _reject,
    resolve: _resolve,
  }
}
