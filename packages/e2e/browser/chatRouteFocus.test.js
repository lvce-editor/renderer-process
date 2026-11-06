import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
import { test } from 'node:test'
import { build } from 'esbuild'
import { chromium } from 'playwright'

const result = await build({
  bundle: true,
  format: 'iife',
  external: ['node:*', 'electron', 'ws'],
  globalName: 'Viewlet',
  entryPoints: [fileURLToPath(new URL('../../renderer-process/src/parts/Viewlet/Viewlet.ts', import.meta.url))],
  write: false,
})

const renderComposer = async (page, focusTiming = '') => {
  await page.evaluate((focusTiming) => {
    const viewlet = globalThis.Viewlet
    const address = document.createElement('input')
    address.name = 'address'
    document.body.append(address)
    if (focusTiming === 'before') address.focus()
    viewlet.createFunctionalRoot('ExtensionView', 991, true)
    viewlet.executeCommands([['Viewlet.appendToBody', 991]])
    globalThis.renderChat = () =>
      viewlet.executeCommands([
        [
          'Viewlet.setDom2',
          991,
          [
            { type: 4, childCount: 1, className: 'Chat' },
            { type: 62, childCount: 0, name: 'composer' },
          ],
        ],
      ])
    globalThis.renderChat()
    if (focusTiming === 'during') address.focus()
    if (focusTiming === 'blur') {
      address.focus()
      address.blur()
    }
  }, focusTiming)
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))))
}

for (const path of ['/chat', '/prefix/chat/']) {
  test(`loading ${path} focuses the composer once and accepts immediate typing`, async () => {
    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.route('https://chat.test/**', (route) => route.fulfill({ body: '<!doctype html><body></body>', contentType: 'text/html' }))
      await page.goto(`https://chat.test${path}`)
      await page.addScriptTag({ content: result.outputFiles[0].text })
      await renderComposer(page)
      assert.equal(await page.locator('[name="composer"]').evaluate((input) => document.activeElement === input), true)
      await page.keyboard.type('Hello without clicking')
      assert.equal(await page.locator('[name="composer"]').inputValue(), 'Hello without clicking')
      await page.locator('[name="address"]').focus()
      await page.evaluate(() => globalThis.renderChat())
      assert.equal(await page.locator('[name="address"]').evaluate((input) => document.activeElement === input), true)
      await page.reload()
      await page.addScriptTag({ content: result.outputFiles[0].text })
      await renderComposer(page)
      assert.equal(await page.locator('[name="composer"]').evaluate((input) => document.activeElement === input), true)
    } finally {
      await browser.close()
    }
  })
}

for (const timing of ['before', 'during', 'blur']) {
  test(`preserves a startup focus choice made ${timing} rendering`, async () => {
    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.route('https://chat.test/**', (route) => route.fulfill({ body: '<!doctype html><body></body>', contentType: 'text/html' }))
      await page.goto('https://chat.test/chat')
      await page.addScriptTag({ content: result.outputFiles[0].text })
      await renderComposer(page, timing)
      assert.equal(await page.locator('[name="composer"]').evaluate((input) => document.activeElement === input), false)
      if (timing !== 'blur') {
        assert.equal(await page.locator('[name="address"]').evaluate((input) => document.activeElement === input), true)
      }
      await page.evaluate(() => globalThis.Viewlet.focusSelectorAfterRender(991, '[name="composer"]'))
      await page.waitForFunction(() => document.activeElement?.getAttribute('name') === 'composer')
    } finally {
      await browser.close()
    }
  })
}

test('ordinary IDE startup does not focus the composer', async () => {
  const browser = await chromium.launch({ headless: true })
  try {
    const page = await browser.newPage()
    await page.addScriptTag({ content: result.outputFiles[0].text })
    await renderComposer(page)
    assert.equal(await page.evaluate(() => document.activeElement === document.body), true)
  } finally {
    await browser.close()
  }
})

for (const scenario of ['late-mount', 'late-layout', 'cancelled']) {
  test(`route focus handles ${scenario} after the initial frames`, async () => {
    const browser = await chromium.launch({ headless: true })
    try {
      const page = await browser.newPage()
      await page.route('https://chat.test/**', (route) => route.fulfill({ body: '<!doctype html><body></body>', contentType: 'text/html' }))
      await page.goto('https://chat.test/chat')
      await page.addScriptTag({ content: result.outputFiles[0].text })
      await page.evaluate((scenario) => {
        const viewlet = globalThis.Viewlet
        viewlet.createFunctionalRoot('ExtensionView', 992, true)
        viewlet.executeCommands([
          [
            'Viewlet.setDom2',
            992,
            [
              { type: 4, childCount: 1, className: 'Chat' },
              { type: 62, childCount: 0, name: 'composer' },
            ],
          ],
        ])
        if (scenario === 'late-layout') {
          viewlet.executeCommands([['Viewlet.appendToBody', 992]])
          document.querySelector('.Chat').style.display = 'none'
        }
      }, scenario)
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => requestAnimationFrame(resolve)))))
      await page.evaluate((scenario) => {
        if (scenario === 'cancelled') {
          const control = document.createElement('input')
          control.name = 'address'
          document.body.append(control)
          control.focus()
        }
        if (scenario === 'late-layout') document.querySelector('.Chat').style.display = ''
        else globalThis.Viewlet.executeCommands([['Viewlet.appendToBody', 992]])
      }, scenario)
      if (scenario === 'cancelled') {
        await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
        assert.equal(await page.locator('[name="address"]').evaluate((input) => document.activeElement === input), true)
      } else {
        await page.waitForFunction(() => document.activeElement?.getAttribute('name') === 'composer')
        await page.keyboard.type('Ready')
        assert.equal(await page.locator('[name="composer"]').inputValue(), 'Ready')
      }
    } finally {
      await browser.close()
    }
  })
}
