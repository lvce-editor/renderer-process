export const sendToIframe = (contentWindow: Window, message: any, origin: string, transfer: any) => {
  console.log({ origin, message, transfer })
  contentWindow.postMessage(message, origin, transfer)
}
