import { getViewletInstance } from '@lvce-editor/virtual-dom'

const pendingSelections = new WeakMap<HTMLInputElement, ReturnType<typeof setTimeout>>()

const state: { codingFocus?: WeakRef<HTMLElement> } = {}

const handleFocus = (event: FocusEvent): void => {
  const target = event.target
  if (target instanceof HTMLElement && !target.closest('.SimpleBrowser') && target.closest('.Main, .Panel, .Editor, .Terminal')) {
    state.codingFocus = new WeakRef(target)
  }
}

const handleFocusOut = (event: FocusEvent): void => {
  const address = event.target
  if (!(address instanceof HTMLInputElement) || address.name !== 'simple-browser-address') return
  // Native WebContents focus can leave activeElement pointing at this input.
  // Defer so reparenting or a newer focus choice can preserve its selection.
  setTimeout(() => {
    const document = address.ownerDocument
    if (!address.isConnected || (document.hasFocus() && document.activeElement === address)) return
    clearTimeout(pendingSelections.get(address))
    pendingSelections.delete(address)
    address.setSelectionRange(0, 0)
  })
}

const cancelPendingAddressSelection = (event: Event): void => {
  const address = event.target
  if (!(address instanceof HTMLInputElement) || address.name !== 'simple-browser-address') return
  clearTimeout(pendingSelections.get(address))
  pendingSelections.delete(address)
}

export const listen = (): void => {
  document.addEventListener('focusin', handleFocus)
  document.addEventListener('focusout', handleFocusOut)
  document.addEventListener('input', cancelPendingAddressSelection)
  document.addEventListener('keydown', cancelPendingAddressSelection)
}

export const restoreCodingFocus = (): boolean => {
  const target = state.codingFocus?.deref()
  if (!target?.isConnected) {
    return false
  }
  target.focus({ preventScroll: true })
  return document.activeElement === target
}

const getAddress = (uid: number): HTMLInputElement | undefined => {
  return getViewletInstance(uid)?.state.$Viewlet.querySelector('[name="simple-browser-address"]')
}

export const captureBrowserAddress = (uid: number) => {
  const address = getAddress(uid)
  return address && document.activeElement === address ? { end: address.selectionEnd, start: address.selectionStart } : undefined
}

export const queueBrowserAddressSelection = (address: HTMLInputElement): void => {
  clearTimeout(pendingSelections.get(address))
  const timer = setTimeout(() => {
    pendingSelections.delete(address)
    if (!address.isConnected) return
    const suggestions = address.closest('.SimpleBrowser')?.querySelector('.SimpleBrowserSuggestions')
    if (suggestions) address.setSelectionRange(address.value.length, address.value.length)
    else address.select()
  })
  pendingSelections.set(address, timer)
}

export const focusBrowserAddress = (uid: number, selection?: { end: number; start: number }): void => {
  const address = getAddress(uid)
  if (!address) return
  address.focus({ preventScroll: true })
  clearTimeout(pendingSelections.get(address))
  pendingSelections.delete(address)
  if (selection) address.setSelectionRange(selection.start, selection.end)
  else address.select()
}

export const revealBrowserTab = (uid: number): void => {
  const root = getViewletInstance(uid)?.state.$Viewlet
  root?.querySelector('.SimpleBrowserTabSelected')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}

const browserParents = new Map<number, Comment>()

export const rememberBrowserParent = (uid: number): void => {
  if (browserParents.has(uid)) return
  const browser = getViewletInstance(uid)?.state.$Viewlet
  if (!browser?.parentNode) return
  const marker = document.createComment('browser workspace position')
  browser.before(marker)
  browserParents.set(uid, marker)
}

export const restoreBrowserParent = (uid: number): void => {
  const marker = browserParents.get(uid)
  browserParents.delete(uid)
  if (!marker) return
  const browser = getViewletInstance(uid)?.state.$Viewlet
  if (browser && marker.isConnected) marker.replaceWith(browser)
  else marker.remove()
}
