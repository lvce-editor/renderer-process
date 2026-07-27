/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('../src/parts/ViewletTerminals/ViewletTerminalsFunctions.ts', () => {
  return {
    handleClickTab: jest.fn(),
  }
})

const ViewletTerminalsEvents = await import('../src/parts/ViewletTerminals/ViewletTerminalsEvents.ts')
const ViewletTerminalsFunctions = await import('../src/parts/ViewletTerminals/ViewletTerminalsFunctions.ts')

const createTerminals = () => {
  const root = document.createElement('div')
  root.className = 'TerminalTabs'
  ComponentUid.set(root, 41)
  root.addEventListener('click', ViewletTerminalsEvents.handleClickTab)

  for (let i = 0; i < 2; i++) {
    const tab = document.createElement('div')
    tab.className = 'TerminalTab'
    const icon = document.createElement('div')
    icon.className = 'TerminalTabIcon'
    const deleteButton = document.createElement('button')
    deleteButton.className = 'TerminalTabDeleteButton'
    const deleteIcon = document.createElement('div')
    deleteIcon.className = 'MaskIcon MaskIconTrash'
    deleteButton.append(deleteIcon)
    tab.append(icon, deleteButton)
    root.append(tab)
  }

  return root
}

test('clicking a terminal tab selects it', () => {
  const root = createTerminals()
  const icon = root.children[1].querySelector('.TerminalTabIcon') as HTMLElement

  icon.click()

  expect(ViewletTerminalsFunctions.handleClickTab).toHaveBeenCalledWith(41, 1, false)
})

test('clicking a terminal trash icon deletes its terminal', () => {
  const root = createTerminals()
  const deleteIcon = root.children[0].querySelector('.MaskIconTrash') as HTMLElement

  deleteIcon.click()

  expect(ViewletTerminalsFunctions.handleClickTab).toHaveBeenCalledWith(41, 0, true)
})

test('clicking outside a terminal tab does nothing', () => {
  const root = createTerminals()

  root.click()

  expect(ViewletTerminalsFunctions.handleClickTab).not.toHaveBeenCalled()
})
