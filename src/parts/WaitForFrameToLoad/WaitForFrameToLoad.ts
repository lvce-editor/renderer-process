import * as Promises from '../Promises/Promises.ts'

export const waitForFrameToLoad = ($Frame: HTMLIFrameElement): Promise<void> => {
  const { resolve, promise } = Promises.withResolvers<void>()
  $Frame.addEventListener('load', resolve, { once: true })
  return promise
}
