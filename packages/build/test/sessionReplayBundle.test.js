import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { test } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import { parseAst } from 'rollup/parseAst'
import { root } from '../src/root.js'

// Inspect the shipped module graph: a lazy source import alone is insufficient
// when the bundler inlines dynamic imports and evaluates the player eagerly.
test('normal renderer startup does not load the session replay player', async () => {
  const visited = new Set()
  const dynamicImports = []
  const visit = async (path) => {
    if (visited.has(path)) return
    visited.add(path)
    const source = await readFile(path, 'utf8')
    assert.ok(!source.includes('SessionReplaySurface'), `Replay player is eagerly bundled in ${path}`)
    const ast = parseAst(source)
    const walk = async (node) => {
      if (!node || typeof node !== 'object') return
      if (node.type === 'ImportExpression' && typeof node.source.value === 'string') {
        dynamicImports.push(fileURLToPath(new URL(node.source.value, pathToFileURL(path))))
      }
      if (['ImportDeclaration', 'ExportNamedDeclaration', 'ExportAllDeclaration'].includes(node.type) && node.source) {
        await visit(join(path, '..', node.source.value))
      }
      for (const value of Object.values(node)) {
        if (Array.isArray(value)) {
          for (const child of value) await walk(child)
        } else if (value && typeof value === 'object') await walk(value)
      }
    }
    await walk(ast)
  }
  await visit(join(root, '.tmp/dist/dist/rendererProcessMain.js'))
  const lazySources = await Promise.all(dynamicImports.map((path) => readFile(path, 'utf8')))
  assert.ok(
    lazySources.some((source) => source.includes('SessionReplaySurface')),
    'Playback must remain available in a lazy chunk',
  )
})
