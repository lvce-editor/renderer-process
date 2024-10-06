import * as HandleBeforeInstallPrompt from '../HandleBeforeInstallPrompt/HandleBeforeInstallPrompt.ts'
import * as HandleContentSecurityPolicyViolation from '../HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.ts'
import * as Platform from '../Platform/Platform.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as UnhandledErrorHandling from '../UnhandledErrorHandling/UnhandledErrorHandling.ts'

const handleWindowMessage = (event) => {
  console.log({ event })
}

export const enable = async (window: Window) => {
  if (location.pathname.includes('/test')) {
    window.addEventListener('message', handleWindowMessage)
  }

  onerror = UnhandledErrorHandling.handleUnhandledError
  onunhandledrejection = UnhandledErrorHandling.handleUnhandledRejection
  if ('SecurityPolicyViolationEvent' in self) {
    window.addEventListener('securitypolicyviolation', HandleContentSecurityPolicyViolation.handleContentSecurityPolicyViolation)
  }

  if (Platform.platform === PlatformType.Web) {
    // disable prompt to download app as pwa
    // @ts-expect-error
    window.onbeforeinstallprompt = HandleBeforeInstallPrompt.handleBeforeInstallPrompt
  }
}
