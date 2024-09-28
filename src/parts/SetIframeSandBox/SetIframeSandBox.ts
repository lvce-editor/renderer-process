export const setIframeSandBox = ($Iframe: HTMLIFrameElement, sandbox: readonly string[]): void => {
  $Iframe.sandbox.add(...sandbox)
}
