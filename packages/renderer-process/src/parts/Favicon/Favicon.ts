let icon: HTMLLinkElement | undefined

// Keep the application's original icons intact so removing this override
// restores the default favicon, including deployments under a path prefix.
export const set = (href: string): void => {
  if (!href) {
    icon?.remove()
    icon = undefined
    return
  }
  const url = new URL(href)
  if (url.protocol !== 'https:') {
    throw new Error('Favicon URL must use HTTPS')
  }
  if (!icon) {
    icon = document.createElement('link')
    icon.rel = 'icon'
  }
  icon.href = url.href
  document.head.append(icon)
}
