/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as Platform from '../src/parts/Platform/Platform.ts'
import * as PlatformType from '../src/parts/PlatformType/PlatformType.ts'

test('platform', () => {
  expect(typeof Platform.platform).toBe('number')
})

test('reads the configured platform from html', () => {
  const config = document.createElement('script')
  config.id = 'Config'
  config.type = 'application/json'
  config.textContent = JSON.stringify({ platform: 'electron' })
  document.head.append(config)

  expect(Platform.getPlatform()).toBe(PlatformType.Electron)

  config.remove()
})
