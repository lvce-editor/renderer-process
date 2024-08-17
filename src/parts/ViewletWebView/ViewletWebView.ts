export * as Events from './ViewletWebViewEvents.ts'

// TODO could use browser view when running in electron
export const setIframe = (state, src, sandbox = []) => {
  if (!src) {
    return
  }
  const { $Viewlet } = state
  const $Parent = $Viewlet.querySelector('.WebViewWrapper')
  const $Iframe = document.createElement('iframe')
  for (const element of sandbox) {
    $Iframe.sandbox.add(element)
  }
  $Iframe.className = 'E2eTestIframe'
  $Iframe.src = src
  $Parent.append($Iframe)
}
