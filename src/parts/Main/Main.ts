import * as Command from '../Command/Command.ts'
import * as HandleBeforeInstallPrompt from '../HandleBeforeInstallPrompt/HandleBeforeInstallPrompt.ts'
import * as HandleContentSecurityPolicyViolation from '../HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.ts'
import * as Module from '../Module/Module.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as UnhandledErrorHandling from '../UnhandledErrorHandling/UnhandledErrorHandling.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'

const handleWindowMessage = (event) => {
  console.log({ event })
}

export const main = async () => {
  if (location.pathname.includes('/test')) {
    window.addEventListener('message', handleWindowMessage)
  }

  onerror = UnhandledErrorHandling.handleUnhandledError
  onunhandledrejection = UnhandledErrorHandling.handleUnhandledRejection
  if ('SecurityPolicyViolationEvent' in self) {
    self.addEventListener('securitypolicyviolation', HandleContentSecurityPolicyViolation.handleContentSecurityPolicyViolation)
  }
  Command.setLoad(Module.load)
  if (Platform.platform === PlatformType.Web) {
    // disable prompt to download app as pwa
    // @ts-expect-error
    window.onbeforeinstallprompt = HandleBeforeInstallPrompt.handleBeforeInstallPrompt
  }
  // TODO this is discovered very late
  await RendererWorker.hydrate()
  VirtualDom.setIpc(RendererWorker)
}
