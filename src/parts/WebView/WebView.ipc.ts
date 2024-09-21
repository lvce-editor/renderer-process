import * as WebView from './WebView.ts'

export const name = 'WebView'

export const Commands = {
  create: WebView.create,
  setPort: WebView.setPort,
  load: WebView.load,
}
