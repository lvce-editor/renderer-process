export * as Events from './ViewletExtensionViewEvents.ts'
import * as SetIframeCredentialless from '../SetIframeCredentialless/SetIframeCredentialless.ts'
import * as SetIframeCsp from '../SetIframeCsp/SetIframeCsp.ts'
import * as SetIframeSandBox from '../SetIframeSandBox/SetIframeSandBox.ts'
import * as SetIframeSrc from '../SetIframeSrc/SetIframeSrc.ts'

export const setIframe = (state, src, sandbox = [], srcDoc = '', csp = '', credentialless = true, title = '') => {
  if (!src && !srcDoc) {
    return
  }
  const { $Viewlet } = state
  $Viewlet.textContent = ''
  const $Iframe = document.createElement('iframe')
  $Iframe.className = 'ExtensionViewIframe'
  $Iframe.title = title
  SetIframeCredentialless.setIframeCredentialless($Iframe, credentialless)
  SetIframeCsp.setIframeCsp($Iframe, csp)
  SetIframeSandBox.setIframeSandBox($Iframe, sandbox)
  SetIframeSrc.setIframeSrc($Iframe, src, srcDoc)
  $Viewlet.append($Iframe)
}
