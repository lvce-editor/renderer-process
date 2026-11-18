const state: { icon: HTMLLinkElement | undefined } = { icon: undefined }

// Keep the application's original icons intact so removing this override
// restores the default favicon, including deployments under a path prefix.
export const set = (href: string): void => {
  if (!href) {
    state.icon?.remove()
    state.icon = undefined
    return
  }
  const url = new URL(href)
  const isImageData = /^data:image\/(?:png;base64,|svg\+xml,)/u.test(href)
  if (url.protocol !== 'https:' && !isImageData) {
    throw new Error('Favicon URL must use HTTPS or PNG/SVG image data')
  }
  if (!state.icon) {
    state.icon = document.createElement('link')
    state.icon.rel = 'icon'
  }
  state.icon.href = url.href
  document.head.append(state.icon)
}
