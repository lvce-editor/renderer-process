import * as Main from './parts/Main/Main.ts'

export const ready = Main.main()
export { invoke as executeCommand } from './parts/RendererWorker/RendererWorker.ts'
