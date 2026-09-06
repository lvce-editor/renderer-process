import { getViewletInstance } from '@lvce-editor/virtual-dom'

const state: { codingFocus?: WeakRef<HTMLElement> } = {}

const handleFocus = (event: FocusEvent): void => {
  const target = event.target
  if (target instanceof HTMLElement && !target.closest('.SimpleBrowser') && target.closest('.Main, .Panel, .Editor, .Terminal')) {
    state.codingFocus = new WeakRef(target)
  }
}

export const listen = (): void => {
  document.addEventListener('focusin', handleFocus)
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

export const focusBrowserAddress = (uid: number, selection?: { end: number; start: number }): void => {
  const address = getAddress(uid)
  if (!address) return
  address.focus({ preventScroll: true })
  if (selection) address.setSelectionRange(selection.start, selection.end)
  else address.select()
}

export const revealBrowserTab = (uid: number): void => {
  const root = getViewletInstance(uid)?.state.$Viewlet
  root?.querySelector('.SimpleBrowserTabSelected')?.scrollIntoView({ block: 'nearest', inline: 'nearest' })
}
