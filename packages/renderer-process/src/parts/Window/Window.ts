import * as BrowserWorkspaceFocus from '../BrowserWorkspaceFocus/BrowserWorkspaceFocus.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const reload = () => {
  location.reload()
}

export const minimize = () => {}

export const maximize = () => {}

export const unmaximize = () => {}

export const close = () => {
  // window.close()
}

export const prepareClose = async (): Promise<void> => {
  await RendererWorker.invoke('SaveState.handleVisibilityChange', 'hidden')
}

export const toggleFullScreen = () => {
  if (document.fullscreenElement) {
    return document.exitFullscreen()
  }
  return document.documentElement.requestFullscreen()
}

export const handleFullScreenChange = (isFullScreen: boolean) => {
  RendererWorker.send('Layout.handleFullScreenChange', isFullScreen)
}

const handleDocumentFullScreenChange = () => {
  handleFullScreenChange(Boolean(document.fullscreenElement))
}

const sendVisibilityChangeHint = () => {
  RendererWorker.send(/* SaveState.handleVisibilityChange */ 'SaveState.handleVisibilityChange', /* visibilityState */ 'hidden')
}

const handleBeforeUnload = () => {
  sendVisibilityChangeHint()
}
const handlePointerLeave = () => {
  sendVisibilityChangeHint()
}

// cannot use visibilty change event because worker cannot process events when page closes
// https://stackoverflow.com/questions/20084348/what-happens-to-a-web-worker-if-i-close-the-page-that-created-this-web-worker/20105455#20105455
// beforeunload event has the same problem, pointerleave event sometimes works
export const onVisibilityChange = () => {
  BrowserWorkspaceFocus.listen()
  window.addEventListener('beforeunload', handleBeforeUnload)
  document.addEventListener('fullscreenchange', handleDocumentFullScreenChange)
  document.addEventListener('pointerleave', handlePointerLeave)
}

export const handleBrowserFullWidthGesture = (): void => {
  RendererWorker.send('Layout.handleBrowserFullWidthGesture')
}

export const captureBrowserAddress = BrowserWorkspaceFocus.captureBrowserAddress
export const focusBrowserAddress = BrowserWorkspaceFocus.focusBrowserAddress
export const restoreCodingFocus = BrowserWorkspaceFocus.restoreCodingFocus
export const revealBrowserTab = BrowserWorkspaceFocus.revealBrowserTab

export const rememberBrowserParent = BrowserWorkspaceFocus.rememberBrowserParent
export const restoreBrowserParent = BrowserWorkspaceFocus.restoreBrowserParent
