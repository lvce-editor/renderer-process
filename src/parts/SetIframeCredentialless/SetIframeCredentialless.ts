export const setIframeCredentialless = ($Iframe: HTMLIFrameElement, credentialless: boolean): void => {
  if (credentialless) {
    // @ts-ignore
    $Iframe.credentialless = credentialless
  }
}
