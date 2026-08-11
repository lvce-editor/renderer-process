/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import * as ViewletExtensionView from '../src/parts/ViewletExtensionView/ViewletExtensionView.ts'

test('focuses the extension view root', () => {
  const $Viewlet = document.createElement('div')
  $Viewlet.tabIndex = 0
  document.body.append($Viewlet)

  ViewletExtensionView.focus({ $Viewlet })

  expect(document.activeElement).toBe($Viewlet)
})
