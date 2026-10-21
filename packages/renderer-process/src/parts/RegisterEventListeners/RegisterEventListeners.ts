import * as VirtualDom from '@lvce-editor/virtual-dom'
import * as ScrollSpeed from '../ScrollSpeed/ScrollSpeed.ts'

export const registerEventListeners = (uid: number, listeners: readonly any[], scrollSpeed: unknown = 1): void => {
  ScrollSpeed.register(uid, listeners, scrollSpeed)
  VirtualDom.registerEventListeners(uid, listeners)
}
