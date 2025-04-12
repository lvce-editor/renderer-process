export const set = ($Iframe: HTMLIFrameElement, permissionPolicy: string) => {
  if (permissionPolicy === undefined) {
    return
  }
  $Iframe.allow = permissionPolicy
}
