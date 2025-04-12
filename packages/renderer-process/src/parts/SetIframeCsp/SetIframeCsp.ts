export const setIframeCsp = ($Iframe: HTMLIFrameElement, csp: string): void => {
  if (csp) {
    // @ts-ignore
    $Iframe.csp = csp
  }
}
