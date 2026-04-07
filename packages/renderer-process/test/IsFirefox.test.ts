/**
 * @jest-environment jsdom
 */
import { afterEach, expect, test } from '@jest/globals'

const originalNavigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator')

const setNavigator = (value) => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    value,
  })
}

afterEach(() => {
  if (originalNavigatorDescriptor) {
    Object.defineProperty(globalThis, 'navigator', originalNavigatorDescriptor)
    return
  }
  // @ts-ignore
  delete globalThis.navigator
})

test('import does not access navigator', async () => {
  Object.defineProperty(globalThis, 'navigator', {
    configurable: true,
    get() {
      throw new Error('navigator should not be accessed during import')
    },
  })

  const IsFirefox = await import('../src/parts/IsFirefox/IsFirefox.ts')

  expect(typeof IsFirefox.getIsFirefox).toBe('function')
})

test('returns false when navigator is not available', async () => {
  // @ts-ignore
  delete globalThis.navigator

  const IsFirefox = await import('../src/parts/IsFirefox/IsFirefox.ts')

  expect(IsFirefox.getIsFirefox()).toBe(false)
})

test('detects firefox from userAgentData brands', async () => {
  setNavigator({
    userAgent: 'Chrome',
    userAgentData: {
      brands: ['Firefox'],
    },
  })

  const IsFirefox = await import('../src/parts/IsFirefox/IsFirefox.ts')

  expect(IsFirefox.getIsFirefox()).toBe(true)
})

test('detects firefox from userAgent string', async () => {
  setNavigator({
    userAgent: 'Mozilla/5.0 Firefox/123.0',
  })

  const IsFirefox = await import('../src/parts/IsFirefox/IsFirefox.ts')

  expect(IsFirefox.getIsFirefox()).toBe(true)
})