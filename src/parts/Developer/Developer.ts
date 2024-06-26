import * as Logger from '../Logger/Logger.ts'

const modules = [
  'ActivityBar',
  'Ajax',
  'Allocator',
  'Callback',
  'Command',
  'Context',
  'ContextMenu',
  'Delay',
  'Developer',
  'DomPool',
  'Editor',
  'Exec',
  'ExtensionHost',
  'FileSystem',
  'KeyBindings',
  'Layout',
  'Main',
  'Notification',
  'Panel',
  'Parts',
  'QuickPick',
  'Renderer',
  'RendererWorker',
  'Search',
  'SharedProcess',
  'SideBar',
  'StatusBar',
  'TitleBar',
  'Viewlet',
  'ViewletController',
  'ViewService',
  'Vscode',
  'Window',
  'Workbench',
  'Worker',
  'Workspace',
]

// TODO send to renderer worker -> renderer worker has all state
export const showState = async () => {
  const state = Object.create(null)
  for (const module of modules) {
    let imported
    try {
      imported = await import(`../${module}/${module}.js`)
    } catch {}
    if (imported?.state) {
      state[module] = imported.state
    }
  }
  Logger.info(state)
}
