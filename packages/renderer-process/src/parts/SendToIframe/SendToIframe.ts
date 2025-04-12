import { VError } from '../VError/VError.ts'

export const sendToIframe = (contentWindow: Window, message: any, origin: string, transfer: any) => {
  try {
    console.log('send to iframe', message)
    contentWindow.postMessage(message, origin, transfer)
  } catch (error) {
    throw new VError(error, `Failed to send message to iframe`)
  }
}
