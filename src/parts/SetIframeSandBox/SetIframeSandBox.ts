export const setIframeSandBox = ($Iframe: HTMLIFrameElement, sandbox: readonly string[]): void => {
  for (const element of sandbox) {
    $Iframe.sandbox.add(element)
  }
}
