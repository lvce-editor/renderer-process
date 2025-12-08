import * as Promises from '../Promises/Promises.ts'

export const waitForFrameToLoad = ($Frame: HTMLIFrameElement): Promise<void> => {
  const { promise, resolve } = Promises.withResolvers<void>()
  $Frame.addEventListener('load', resolve, { once: true })
  return promise
}
