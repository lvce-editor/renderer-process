export const setIframeSrc = ($Iframe: HTMLIFrameElement, src: string, srcDoc: string = ''): void => {
  if (src) {
    $Iframe.src = src
  } else if (srcDoc) {
    $Iframe.srcdoc = srcDoc
  }
}
