import * as WebView from './WebView.ts'

export const name = 'WebView'

export const Commands = {
  appendOnly: WebView.appendOnly,
  create: WebView.create,
  dispose: WebView.dispose,
  load: WebView.load,
  loadOnly: WebView.loadOnly,
  setPort: WebView.setPort,
}
