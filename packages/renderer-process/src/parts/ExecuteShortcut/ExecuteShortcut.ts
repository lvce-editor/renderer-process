import * as EditorEventQueue from '../EditorEventQueue/EditorEventQueue.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

/** Dispatches an embedding application's shortcut in order with native editor input. */
export const executeShortcut = (command: string, ...args: readonly unknown[]): Promise<void> =>
  EditorEventQueue.runShortcut(() => RendererWorker.invoke(command, ...args))
