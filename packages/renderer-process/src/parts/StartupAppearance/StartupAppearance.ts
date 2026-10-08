export const initialize = (): void => {
  try {
    const savedLayout = JSON.parse(localStorage.getItem('Layout') || 'null')
    if (savedLayout?.aiNativeLayout !== true) return

    let settings
    try {
      settings = JSON.parse(localStorage.getItem('settings') || 'null')
    } catch {
      settings = null
    }

    const root = document.documentElement
    root.classList.add('AiNativeLayoutStartup')
    if (settings?.['chat2.aiNativeTheme'] === 'claude') {
      root.classList.add('AiNativeLayoutStartupClaude')
    }

    const observer = new MutationObserver(() => {
      if (!document.querySelector('.Workbench.AiNativeLayout')) return
      root.classList.remove('AiNativeLayoutStartup', 'AiNativeLayoutStartupClaude')
      observer.disconnect()
    })
    observer.observe(document, { attributeFilter: ['class'], attributes: true, childList: true, subtree: true })
  } catch {
    // Storage can be unavailable in restricted browser contexts.
  }
}
