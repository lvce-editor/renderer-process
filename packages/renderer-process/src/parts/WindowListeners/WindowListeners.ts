import * as HandleContentSecurityPolicyViolation from '../HandleContentSecurityPolicyViolation/HandleContentSecurityPolicyViolation.ts'
import * as UnhandledErrorHandling from '../UnhandledErrorHandling/UnhandledErrorHandling.ts'

const handleWindowMessage = (event) => {
  // eslint-disable-next-line no-console
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
}
