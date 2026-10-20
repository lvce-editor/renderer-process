import * as Tauri from '../Tauri/Tauri.ts'

export const redirectToUrl = (url: string) => {
  window.location.assign(url)
}

export const openUrl = (url: string, useRedirect: boolean = false) => {
  if (Tauri.isAvailable()) {
    return Tauri.openUrl(url)
  }
  if (useRedirect) {
    redirectToUrl(url)
    return
  }
  window.open(url)
}
