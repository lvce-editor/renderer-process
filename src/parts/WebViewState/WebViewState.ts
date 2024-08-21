const webViews: Record<number, HTMLIFrameElement> = Object.create(null)

export const set = (id: number, webView: HTMLIFrameElement): void => {
  webViews[id] = webView
}

export const get = (id: number) => {
  return webViews[id]
}
