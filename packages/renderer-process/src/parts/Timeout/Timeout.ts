export const short = async () => {
  await new Promise((resolve) => setTimeout(resolve, 1000))
}

export const waitForMutation = async (maxDelay: number) => {
  const disposables = []
  await Promise.race([
    new Promise((resolve) => {
      const timeout = setTimeout(resolve, maxDelay)
      // @ts-expect-error
      disposables.push(() => {
        clearTimeout(timeout)
      })
    }),
    new Promise((resolve) => {
      const callback = (mutations) => {
        resolve(undefined)
      }
      const observer = new MutationObserver(callback)
      observer.observe(document.body, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true,
      })
      // @ts-expect-error
      disposables.push(() => {
        observer.disconnect()
      })
    }),
  ])
  for (const disposable of disposables) {
    // @ts-expect-error
    disposable()
  }
}
