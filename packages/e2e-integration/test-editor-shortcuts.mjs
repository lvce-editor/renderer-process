import assert from 'node:assert/strict'

export const test = async ({ page }) => {
  await page.locator('#TestOverlay').evaluate((element) => element.remove())
  const worker = page.workers().find((entry) => /\/renderer-worker\/(?:src|dist)\/rendererWorkerMain/.test(entry.url()))
  assert.ok(worker)
  // Expose the cross-port race deterministically instead of relying on machine speed.
  await worker.evaluate(async () => {
    const { state } = await import('/packages/renderer-worker/src/parts/IsTest/IsTest.js')
    state.isTest = false
    const Command = await import('/packages/renderer-worker/src/parts/Command/Command.js')
    await Command.loadCommand('KeyBindings.handleKeyBinding')
    globalThis.shortcutCalls = 0
    globalThis.shortcutGate = Promise.withResolvers()
    globalThis.shortcutEntered = Promise.withResolvers()
    const original = Command.state.commands['KeyBindings.handleKeyBinding']
    globalThis.restoreShortcutHandler = () => {
      Command.register('KeyBindings.handleKeyBinding', original)
    }
    Command.register('KeyBindings.handleKeyBinding', async (...args) => {
      globalThis.shortcutCalls++
      globalThis.shortcutEntered.resolve()
      await globalThis.shortcutGate.promise
      return original(...args)
    })
  })
  try {
    const input = page.locator('.Editor textarea').last()
    await input.focus()
    await page.keyboard.type('seed')
    const waitForText = (text) =>
      page.waitForFunction(async (expected) => {
        const script = [...document.querySelectorAll('script[type="module"][src]')].find((entry) => entry.src.includes('rendererProcessMain'))
        const renderer = await import(script.src)
        const textDocument = await renderer.executeCommand('GetActiveEditor.getTextDocument')
        return textDocument?.text === expected
      }, text)
    await waitForText('seed')
    await page.keyboard.press('ControlOrMeta+a')
    await worker.evaluate(() => globalThis.shortcutEntered.promise)
    await input.evaluate((target) =>
      target.dispatchEvent(
        new InputEvent('beforeinput', {
          bubbles: true,
          cancelable: true,
          data: 'replacement',
          inputType: 'insertText',
        }),
      ),
    )
    await worker.evaluate(async () => {
      await new Promise((resolve) => setTimeout(resolve, 100))
    })
    await page.evaluate(async () => {
      const script = [...document.querySelectorAll('script[type="module"][src]')].find((entry) => entry.src.includes('rendererProcessMain'))
      const renderer = await import(script.src)
      const textDocument = await renderer.executeCommand('GetActiveEditor.getTextDocument')
      if (textDocument.text !== 'seed') throw new Error(`Input overtook pending shortcut: ${textDocument.text}`)
    })
    await worker.evaluate(() => globalThis.shortcutGate.resolve())
    await waitForText('replacement')
    // Queue consecutive shortcut/input groups without waiting for their results.
    await page.keyboard.press('ControlOrMeta+a')
    await page.keyboard.type('first')
    await page.keyboard.press('ControlOrMeta+a')
    await page.keyboard.type('second')
    await waitForText('second')
    assert.ok(await worker.evaluate(() => globalThis.shortcutCalls > 0), 'Delayed shortcut handler must execute')
  } finally {
    await worker.evaluate(() => {
      globalThis.shortcutGate.resolve()
      globalThis.restoreShortcutHandler()
    })
  }
}
