/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'
import * as ViewletActivityBarEvents from '../src/parts/ViewletActivityBar/ViewletActivityBarEvents.ts'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('../src/parts/ViewletSourceControl/ViewletSourceControlFunctions.ts', () => {
  return {
    handleButtonClick: jest.fn(),
    handleClick: jest.fn(),
    handleFocus: jest.fn(),
    handleInput: jest.fn(),
    handleMouseOut: jest.fn(),
    handleMouseOver: jest.fn(),
  }
})

const ViewletSourceControlFunctions = await import('../src/parts/ViewletSourceControl/ViewletSourceControlFunctions.ts')
const ViewletSourceControlEvents = await import('../src/parts/ViewletSourceControl/ViewletSourceControlEvents.ts')

const createIcon = (): HTMLElement => {
  const icon = document.createElement('span')
  icon.className = 'ActivityBarItemIcon'
  const maskIcon = document.createElement('span')
  maskIcon.className = 'MaskIcon'
  const decoration = document.createElement('span')
  decoration.className = 'MaskIconDecoration'
  maskIcon.append(decoration)
  icon.append(maskIcon)
  return icon
}

const dispatchActivityBarMouseDown = (target: HTMLElement): readonly unknown[] => {
  let result: readonly unknown[] = []
  target.closest('.ActivityBar')?.addEventListener('mousedown', (event) => {
    result = ViewletActivityBarEvents.handleMouseDown(event)
  })
  target.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, button: 0, clientX: 12, clientY: 34 }))
  return result
}

const createActivityBar = (): { activityBar: HTMLElement; firstItem: HTMLButtonElement; secondItem: HTMLButtonElement } => {
  const activityBar = document.createElement('div')
  activityBar.className = 'ActivityBar'
  const firstItem = document.createElement('button')
  firstItem.className = 'ActivityBarItem'
  firstItem.append(createIcon())
  const secondItem = document.createElement('button')
  secondItem.className = 'ActivityBarItem'
  secondItem.append(createIcon())
  activityBar.append(firstItem, secondItem)
  return { activityBar, firstItem, secondItem }
}

test('activity bar handles a mouse down on the item', () => {
  const { firstItem } = createActivityBar()

  expect(dispatchActivityBarMouseDown(firstItem)).toEqual(['handleClickIndex', 0, 0, 12, 34])
})

test('activity bar handles a mouse down on the item icon', () => {
  const { secondItem } = createActivityBar()
  const icon = secondItem.querySelector('.ActivityBarItemIcon') as HTMLElement

  expect(dispatchActivityBarMouseDown(icon)).toEqual(['handleClickIndex', 0, 1, 12, 34])
})

test('activity bar handles a mouse down on a nested mask icon', () => {
  const { secondItem } = createActivityBar()
  const maskIcon = secondItem.querySelector('.MaskIcon') as HTMLElement

  expect(dispatchActivityBarMouseDown(maskIcon)).toEqual(['handleClickIndex', 0, 1, 12, 34])
})

test('activity bar handles a mouse down on a deeply nested icon decoration', () => {
  const { secondItem } = createActivityBar()
  const decoration = secondItem.querySelector('.MaskIconDecoration') as HTMLElement

  expect(dispatchActivityBarMouseDown(decoration)).toEqual(['handleClickIndex', 0, 1, 12, 34])
})

const createSourceControl = (): { firstButton: HTMLButtonElement; root: HTMLElement; secondButton: HTMLButtonElement } => {
  const root = document.createElement('div')
  root.className = 'SourceControlItems'
  ComponentUid.set(root, 41)
  const firstButton = document.createElement('button')
  firstButton.className = 'SourceControlButton'
  firstButton.append(createIcon())
  const secondButton = document.createElement('button')
  secondButton.className = 'SourceControlButton'
  secondButton.append(createIcon())
  root.append(firstButton, secondButton)
  root.addEventListener('click', ViewletSourceControlEvents.handleClick)
  return { firstButton, root, secondButton }
}

test('source control handles a click on an action button', () => {
  const { firstButton } = createSourceControl()

  firstButton.click()

  expect(ViewletSourceControlFunctions.handleButtonClick).toHaveBeenCalledWith(41, 0)
})

test('source control handles a click on an action icon', () => {
  const { secondButton } = createSourceControl()
  const icon = secondButton.querySelector('.ActivityBarItemIcon') as HTMLElement

  icon.click()

  expect(ViewletSourceControlFunctions.handleButtonClick).toHaveBeenCalledWith(41, 1)
})

test('source control handles a click on a nested mask icon', () => {
  const { secondButton } = createSourceControl()
  const maskIcon = secondButton.querySelector('.MaskIcon') as HTMLElement

  maskIcon.click()

  expect(ViewletSourceControlFunctions.handleButtonClick).toHaveBeenCalledWith(41, 1)
})

test('source control handles a click on a deeply nested icon decoration', () => {
  const { secondButton } = createSourceControl()
  const decoration = secondButton.querySelector('.MaskIconDecoration') as HTMLElement

  decoration.click()

  expect(ViewletSourceControlFunctions.handleButtonClick).toHaveBeenCalledWith(41, 1)
})
