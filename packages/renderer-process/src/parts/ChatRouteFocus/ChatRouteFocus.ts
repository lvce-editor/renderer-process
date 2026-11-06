import { getViewletInstance } from '@lvce-editor/virtual-dom'

const selector = 'textarea[name="composer"]'
const state: { handled: boolean; pending?: { cancel: () => void; id: number } } = { handled: false }

const hasFocus = (): boolean =>
  !!document.activeElement && document.activeElement !== document.body && document.activeElement !== document.documentElement

export const dispose = (viewletId): void => {
  const pending = state.pending
  if (pending && pending.id === viewletId) pending.cancel()
}

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
  let mutations: MutationObserver | undefined
  let sizes: ResizeObserver | undefined
  let observed: HTMLTextAreaElement | undefined
  const cancel = (): void => {
    cancelled = true
    document.removeEventListener('focusin', cancel, true)
    mutations?.disconnect()
    sizes?.disconnect()
    state.pending = undefined
  }
  state.pending = { cancel, id: viewletId }
  document.addEventListener('focusin', cancel, { capture: true })
  const tryFocus = (): void => {
    if (cancelled) return
    const input = getViewletInstance(viewletId)?.state.$Viewlet.querySelector(selector)
    if (hasFocus() || !(input instanceof HTMLTextAreaElement)) {
      cancel()
      return
    }
    if (input.isConnected && input.getClientRects().length > 0) {
      input.focus({ preventScroll: true })
      if (document.activeElement === input) {
        cancel()
        return
      }
    }
    // A detached or hidden first render is not the user's focus opportunity.
    // Watch actual mounting/layout rather than consuming it after a frame count.
    mutations ??= new MutationObserver(tryFocus)
    sizes ??= new ResizeObserver(tryFocus)
    mutations.observe(document.body, {
      attributeFilter: ['class', 'style', 'hidden', 'disabled', 'inert'],
      attributes: true,
      childList: true,
      subtree: true,
    })
    if (observed !== input) {
      sizes.disconnect()
      sizes.observe(input)
      observed = input
    }
  }
  requestAnimationFrame(() => requestAnimationFrame(tryFocus))
}
