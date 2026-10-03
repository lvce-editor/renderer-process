interface TauriWindow extends Window {
  readonly __TAURI__?: {
    readonly core?: {
      readonly invoke: (command: string) => Promise<unknown>
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
