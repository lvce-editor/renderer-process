interface WindowControlsOverlayLike {
  getTitlebarAreaRect(): DOMRect
}

const getWindowControlsOverlay = (): WindowControlsOverlayLike | undefined => {
  const navigatorWithWindowControls = globalThis.navigator as Navigator & {
    readonly windowControlsOverlay?: WindowControlsOverlayLike
  }
  return navigatorWithWindowControls.windowControlsOverlay
}

const getTitleBarRect = (): DOMRect | undefined => {
  return getWindowControlsOverlay()?.getTitlebarAreaRect()
}

const getTitleBarHeight = (): number => {
  return getTitleBarRect()?.height ?? 0
}

export const getTitleBarLeftInset = (): number => {
  return getTitleBarRect()?.x ?? 0
}

export const getBounds = () => {
  return {
    titleBarHeight: getTitleBarHeight(),
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  }
}
