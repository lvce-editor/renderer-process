const getTitleBarHeight = () => {
  if (
    // @ts-expect-error
    navigator.windowControlsOverlay?.getTitlebarAreaRect
  ) {
    // @ts-expect-error
    const titleBarRect = navigator.windowControlsOverlay.getTitlebarAreaRect()
    return titleBarRect.height
  }
  return 0
}

export const getBounds = () => {
  return {
    titleBarHeight: getTitleBarHeight(),
    windowHeight: window.innerHeight,
    windowWidth: window.innerWidth,
  }
}
