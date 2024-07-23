export * as Events from './ViewletE2eTestsEvents.ts'

export const setIframe = (state, src) => {
  const $ExistingIframe = document.querySelector('.E2eTestsIframe')
  if ($ExistingIframe) {
    $ExistingIframe.remove()
  }
  const $Iframe = document.createElement('iframe')
  $Iframe.className = 'E2eTestsIframe'
  $Iframe.src = src
  document.body.append($Iframe)
}
