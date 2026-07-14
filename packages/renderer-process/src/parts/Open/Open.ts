export const redirectToUrl = (url: string) => {
  window.location.assign(url)
}

export const openUrl = (url: string, useRedirect: boolean = false) => {
  if (useRedirect) {
    redirectToUrl(url)
    return
  }
  window.open(url)
}
