import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { after, before, test } from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright'

let browser
let bundle
let css

before(async () => {
  const result = await build({
    bundle: true,
    format: 'iife',
    globalName: 'ViewletTerminal',
    entryPoints: [fileURLToPath(new URL('../../renderer-process/src/parts/ViewletTerminal2/ViewletTerminal2.ts', import.meta.url))],
    plugins: [
      {
        name: 'capture-terminal-commands',
        setup(builder) {
          builder.onResolve({ filter: /ForwardCommand\.ts$/ }, () => ({ path: 'commands', namespace: 'test' }))
          builder.onLoad({ filter: /.*/, namespace: 'test' }, () => ({
            contents: `
              export const handleInput = (uid, data) => globalThis.inputs.push([uid, data])
              export const handleLink = (uid, uri) => globalThis.links.push([uid, uri])
              export const resize = () => {}
            `,
          }))
        },
      },
    ],
    write: false,
  })
  bundle = result.outputFiles[0].text
  css = await readFile(new URL(import.meta.resolve('@xterm/xterm/css/xterm.css')), 'utf8')
  browser = await chromium.launch({ headless: true })
})

after(async () => {
  await browser?.close()
})

for (const modifiers of [[], ['Control'], ['Alt']]) {
  test(`opening a terminal link with ${modifiers[0] || 'no modifier'} sends no shell input`, async () => {
    const page = await browser.newPage()
    try {
      await page.setContent('<div></div>')
      await page.addStyleTag({ content: `${css} .XtermTerminal { width: 800px; height: 340px; }` })
      await page.addScriptTag({ content: bundle })
      await page.evaluate(`(async () => {
        globalThis.inputs = []
        globalThis.links = []
        globalThis.state = ViewletTerminal.create()
        document.body.append(state.$Viewlet)
        ViewletTerminal.attachEvents(state)
        await ViewletTerminal.setTerminal(state, 42)
        await new Promise(resolve => state.terminal.write(
          'server listening on http://localhost:3000/\\r\\nwatching for changes\\r\\n\\r\\n\\r\\n', resolve))
        await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
      })()`)
      const point = await page.evaluate(`(() => {
        const rect = state.$Viewlet.querySelector('.xterm-screen').getBoundingClientRect()
        return { x: rect.x + 25.5 * rect.width / state.terminal.cols, y: rect.y + 0.5 * rect.height / state.terminal.rows }
      })()`)
      await page.mouse.move(point.x, point.y)
      await page.waitForFunction("state.$Viewlet.querySelector('.xterm-screen').classList.contains('xterm-cursor-pointer')")
      for (const modifier of modifiers) {
        await page.keyboard.down(modifier)
      }
      await page.mouse.click(point.x, point.y)
      for (const modifier of modifiers) {
        await page.keyboard.up(modifier)
      }
      assert.deepEqual(await page.evaluate('links'), [[42, 'http://localhost:3000/']])
      assert.deepEqual(await page.evaluate('inputs'), [])

      await page.keyboard.type('test')
      await page.keyboard.press('ArrowLeft')
      assert.equal(await page.evaluate("inputs.map(([, data]) => data).join('')"), 'test\u001B[D')
      await page.evaluate('ViewletTerminal.dispose(state)')
    } finally {
      await page.close()
    }
  })
}
