import { getViewletInstance } from '@lvce-editor/virtual-dom'

const selector = 'textarea[name="composer"]'
const state = { handled: false }

const hasFocus = (): boolean =>
  !!document.activeElement && document.activeElement !== document.body && document.activeElement !== document.documentElement

// The route's composer can arrive after the initial workbench frame.
export const focus = (viewletId): void => {
  if (state.handled || !/(?:^|\/)chat\/?$/.test(location.pathname)) {
    return
  }
  if (!getViewletInstance(viewletId)?.state.$Viewlet.querySelector(selector)) {
    return
  }
  state.handled = true
  if (hasFocus()) {
    return
  }
  let cancelled = false
  const cancel = (): void => {
    cancelled = true
    document.removeEventListener('focusin', cancel, true)
  }
  document.addEventListener('focusin', cancel, { capture: true })
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const shouldFocus = !cancelled && !hasFocus()
      cancel()
      // Resolve the current DOM: startup may have rendered the view again.
      const input = getViewletInstance(viewletId)?.state.$Viewlet.querySelector(selector)
      if (shouldFocus && input instanceof HTMLTextAreaElement && input.isConnected && input.getClientRects().length > 0) {
        input.focus({ preventScroll: true })
      }
    })
  })
}
