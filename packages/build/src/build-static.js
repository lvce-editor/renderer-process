import { cp, readFile, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { root } from './root.js'

const sharedProcessPath = join(root, 'packages', 'server', 'node_modules', '@lvce-editor', 'shared-process', 'index.js')

const sharedProcessUrl = pathToFileURL(sharedProcessPath).toString()

const sharedProcess = await import(sharedProcessUrl)

process.env.PATH_PREFIX = '/renderer-process'
const { commitHash } = await sharedProcess.exportStatic({
  root,
  extensionPath: '',
})

export const getRemoteUrl = (path) => {
  const url = pathToFileURL(path).toString().slice(8)
  return `/remote/${url}`
}

const indexHtmlPath = join(root, 'dist', 'index.html')

const content = await readFile(indexHtmlPath, 'utf8')
const workerPath = join(root, '.tmp/dist/dist/rendererProcessMain.js')
const remoteUrl = getRemoteUrl(workerPath)

const occurrence = `${remoteUrl}`
const replacement = `/${commitHash}/packages/renderer-process/dist/rendererProcessMain.js`
const newContent = content.replace(occurrence, replacement)
await writeFile(indexHtmlPath, newContent)

await cp(join(root, 'dist'), join(root, '.tmp', 'static'), { recursive: true })
