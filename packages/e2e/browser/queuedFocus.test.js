import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright'

test('a queued Explorer render preserves a newer address-bar focus choice', async () => {
  const result = await build({
    bundle: true,
    format: 'iife',
    external: ['node:*', 'electron', 'ws'],
    globalName: 'Viewlet',
    entryPoints: [fileURLToPath(new URL('../../renderer-process/src/parts/Viewlet/Viewlet.ts', import.meta.url))],
    write: false,
  })
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.addScriptTag({ content: result.outputFiles[0].text })
    const transaction = await page.evaluate(() => {
      const viewlet = globalThis.Viewlet
      viewlet.createFunctionalRoot('Explorer', 901, true)
      viewlet.executeCommands([['Viewlet.appendToBody', 901]])
      const explorer = document.body.firstElementChild
      explorer.className = 'Explorer'
      explorer.tabIndex = 0
      const address = document.createElement('input')
      address.name = 'address'
      document.body.append(address)
      explorer.focus()
      return viewlet.queueCommands(901, [
        ['Viewlet.setBounds', 901, 0, 0, 321, 100],
        ['Viewlet.focusSelector', 901, '.Explorer'],
      ])
    })
    await page.locator('[name="address"]').fill('known')
    await page.evaluate((id) => globalThis.Viewlet.commitPending(901, id), transaction)
    assert.equal(await page.locator('[name="address"]').evaluate((input) => document.activeElement === input), true)
    assert.equal(await page.locator('[name="address"]').inputValue(), 'known')
    assert.equal(await page.locator('.Explorer').evaluate((element) => element.style.width), '321px')
  } finally {
    await browser.close()
  }
})
