export const set = ($Iframe: HTMLIFrameElement, permissionPolicy: string | undefined) => {
  if (!permissionPolicy) {
    return
  }
  $Iframe.allow = permissionPolicy
}
