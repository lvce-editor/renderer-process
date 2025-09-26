// import { readdir, readFile, writeFile } from 'node:fs/promises'
// import { dirname, join } from 'node:path'
// import { fileURLToPath, pathToFileURL } from 'node:url'

// const __dirname = dirname(fileURLToPath(import.meta.url))

// const root = join(__dirname, '..', '..', '..')

// export const getRemoteUrl = (path) => {
//   const url = pathToFileURL(path).toString().slice(8)
//   return `/remote/${url}`
// }

// const nodeModulesPath = join(root, 'packages', 'server', 'node_modules')
// const serverStaticPath = join(nodeModulesPath, '@lvce-editor', 'static-server', 'static')

// const RE_COMMIT_HASH = /^[a-z\d]+$/
// const isCommitHash = (dirent) => {
//   return dirent.length === 7 && dirent.match(RE_COMMIT_HASH)
// }

// const dirents = await readdir(serverStaticPath)
// const commitHash = dirents.find(isCommitHash) || ''
// const indexHtmlPath = join(serverStaticPath, 'index.html')

// const content = await readFile(indexHtmlPath, 'utf-8')

// // Paths for different development contexts
// const rendererProcessPath = join(root, '.tmp/dist/dist/rendererProcessMain.js')

// // Generate URLs - renderer process uses remote URL, workers use static server paths
// const rendererProcessUrl = getRemoteUrl(rendererProcessPath)
// const rendererWorkerUrl = `/${commitHash}/packages/renderer-worker/src/rendererWorkerMain.ts`
// const editorWorkerUrl = `/${commitHash}/packages/editor-worker/dist/editorWorkerMain.js`
// const extensionHostWorkerUrl = `/${commitHash}/packages/extension-host-worker/dist/extensionHostWorkerMain.js`
// const syntaxHighlightingWorkerUrl = `/${commitHash}/packages/syntax-highlighting-worker/dist/syntaxHighlightingWorkerMain.js`

// // Create config object
// const config = {
//   rendererWorkerUrl,
//   editorWorkerUrl,
//   extensionHostWorkerUrl,
//   syntaxHighlightingWorkerUrl,
// }

// // Add Config element to HTML
// const configElement = `<script id="Config" type="application/json">${JSON.stringify(config, null, 2)}</script>`

// // Update renderer process script path
// const rendererProcessOccurrence = `/${commitHash}/packages/renderer-process/dist/rendererProcessMain.js`
// const rendererProcessReplacement = rendererProcessUrl

// let newContent = content.replace(rendererProcessOccurrence, rendererProcessReplacement)

// // Add or update Config element before the closing head tag
// if (newContent.includes('id="Config"')) {
//   // Update existing config
//   const configRegex = /<script id="Config" type="application\/json">.*?<\/script>/
//   newContent = newContent.replace(configRegex, configElement)
// } else {
//   // Add new config
//   newContent = newContent.replace('</head>', `  ${configElement}\n</head>`)
// }

// await writeFile(indexHtmlPath, newContent)
