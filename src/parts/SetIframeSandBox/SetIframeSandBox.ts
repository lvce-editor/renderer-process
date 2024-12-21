export const setIframeSandBox = ($Iframe: HTMLIFrameElement, sandbox: readonly string[]): void => {
  if (sandbox.length === 0) {
    return
  }
  $Iframe.sandbox.add(...sandbox)
}
