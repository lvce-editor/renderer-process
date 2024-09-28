import * as WebView from './WebView.ts'

export const name = 'WebView'

export const Commands = {
  create: WebView.create,
  load: WebView.load,
  setPort: WebView.setPort,
  dispose: WebView.dispose,
}
