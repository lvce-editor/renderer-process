import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright'

test('notifications can be dismissed independently after an asynchronous operation', async () => {
  const result = await build({
    bundle: true,
    format: 'iife',
    external: ['node:*', 'electron', 'ws'],
    globalName: 'Notifications',
    entryPoints: [fileURLToPath(new URL('../../renderer-process/src/parts/Notification/Notification.ts', import.meta.url))],
    write: false,
  })
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.addScriptTag({ content: result.outputFiles[0].text })
    const id = await page.evaluate(() => globalThis.Notifications.create('info', 'Continue signing in'))
    await page.evaluate(() => globalThis.Notifications.create('error', 'Unrelated error'))
    assert.deepEqual(await page.locator('.NotificationMessage').allTextContents(), ['Continue signing in', 'Unrelated error'])
    await page.evaluate((id) => globalThis.Notifications.dispose(id), id)
    assert.deepEqual(await page.locator('.NotificationMessage').allTextContents(), ['Unrelated error'])
    await page.locator('.NotificationCloseButton').click()
    await page.evaluate((id) => globalThis.Notifications.dispose(id), id)
    assert.equal(await page.locator('.Notification').count(), 0)
    assert.equal(await page.locator('#Widgets').count(), 0)
  } finally {
    await browser.close()
  }
})
