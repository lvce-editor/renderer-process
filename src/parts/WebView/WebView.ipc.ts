import * as WebView from './WebView.ts'

export const name = 'WebView'

export const Commands = {
  create: WebView.create,
  load: WebView.load,
  loadOnly: WebView.loadOnly,
  appendOnly: WebView.appendOnly,
  setPort: WebView.setPort,
  dispose: WebView.dispose,
}
