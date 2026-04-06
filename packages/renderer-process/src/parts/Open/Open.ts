export const openUrl = (url: string, useRedirect: boolean = false) => {
  if (useRedirect) {
    window.location.href = url
  } else {
    window.open(url)
  }
}
