interface TauriWindow extends Window {
  readonly __TAURI__?: {
    readonly core?: {
      readonly invoke: (command: string) => Promise<unknown>
    }
    readonly dialog?: {
      readonly open: (options: { directory: true; multiple: false; title: string }) => Promise<string | null>
    }
  }
}

export const isAvailable = (): boolean => {
  const tauriWindow = window as TauriWindow
  return typeof tauriWindow.__TAURI__?.core?.invoke === 'function'
}

export const toggleDevtools = async (): Promise<void> => {
  const tauriWindow = window as TauriWindow
  const core = tauriWindow.__TAURI__?.core
  if (!core) {
    throw new Error('Tauri is not available')
  }
  await core.invoke('toggle_devtools')
}

export const openNewWindow = async (): Promise<void> => {
  const tauriWindow = window as TauriWindow
  const core = tauriWindow.__TAURI__?.core
  if (!core) {
    throw new Error('Tauri is not available')
  }
  await core.invoke('open_new_window')
}

export const openFolder = async (): Promise<string | null> => {
  const tauriWindow = window as TauriWindow
  const dialog = tauriWindow.__TAURI__?.dialog
  if (!dialog) {
    throw new Error('Tauri is not available')
  }
  return dialog.open({ directory: true, multiple: false, title: 'Open Folder' })
}
