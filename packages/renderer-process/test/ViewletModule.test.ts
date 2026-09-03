import { expect, test } from '@jest/globals'
import * as ViewletModule from '../src/parts/ViewletModule/ViewletModule.ts'
import * as ViewletModuleId from '../src/parts/ViewletModuleId/ViewletModuleId.ts'

test('loads the simple browser history functional viewlet', () => {
  expect(ViewletModule.load(ViewletModuleId.SimpleBrowserHistory)).toBeDefined()
})
