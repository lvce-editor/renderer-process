/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'

beforeEach(() => {
  jest.clearAllMocks()
})

jest.unstable_mockModule('../src/parts/RendererWorker/RendererWorker.ts', () => {
  return {
    send: jest.fn(),
  }
})

const RendererWorker = await import('../src/parts/RendererWorker/RendererWorker.ts')
const ViewletPanel = await import('../src/parts/ViewletPanel/ViewletPanel.ts')
const ViewletSideBar = await import('../src/parts/ViewletSideBar/ViewletSideBar.ts')

const createAction = (command: string): HTMLButtonElement => {
  const action = document.createElement('button')
  action.className = 'IconButton'
  action.dataset.command = command
  const icon = document.createElement('span')
  icon.className = 'MaskIcon'
  const iconDecoration = document.createElement('span')
  iconDecoration.className = 'MaskIconDecoration'
  icon.append(iconDecoration)
  action.append(icon)
  return action
}

const expectAction = (uid: number, index: number, command: string): void => {
  expect(RendererWorker.send).toHaveBeenCalledTimes(1)
  expect(RendererWorker.send).toHaveBeenCalledWith('Viewlet.executeViewletCommand', uid, 'handleClickAction', index, command)
}

test('sidebar action handles a click on the button', () => {
  const state = ViewletSideBar.create()
  const action = createAction('sample.refresh')
  state.$SidebarTitleArea.append(action)
  ComponentUid.set(state.$SidebarTitleArea, 21)
  ViewletSideBar.attachEvents(state)

  action.click()

  expectAction(21, 1, 'sample.refresh')
})

test('sidebar action handles a click on the icon', () => {
  const state = ViewletSideBar.create()
  const actions = document.createElement('div')
  const firstAction = createAction('sample.first')
  const secondAction = createAction('sample.second')
  actions.append(firstAction, secondAction)
  state.$SidebarTitleArea.append(actions)
  ComponentUid.set(state.$SidebarTitleArea, 22)
  ViewletSideBar.attachEvents(state)

  const icon = secondAction.querySelector('.MaskIcon') as HTMLElement
  icon.click()

  expectAction(22, 1, 'sample.second')
})

test('sidebar action handles a click on a deeply nested icon element', () => {
  const state = ViewletSideBar.create()
  const action = createAction('sample.deep')
  state.$SidebarTitleArea.append(action)
  ComponentUid.set(state.$SidebarTitleArea, 23)
  ViewletSideBar.attachEvents(state)

  const iconDecoration = action.querySelector('.MaskIconDecoration') as HTMLElement
  iconDecoration.click()

  expectAction(23, 1, 'sample.deep')
})

test('sidebar ignores an icon button without an action command', () => {
  const state = ViewletSideBar.create()
  const action = createAction('sample.missing')
  delete action.dataset.command
  state.$SidebarTitleArea.append(action)
  ComponentUid.set(state.$SidebarTitleArea, 24)
  ViewletSideBar.attachEvents(state)

  const icon = action.querySelector('.MaskIcon') as HTMLElement
  icon.click()

  expect(RendererWorker.send).not.toHaveBeenCalled()
})

test('panel action handles a click on the button', () => {
  const state = ViewletPanel.create()
  const action = createAction('sample.run')
  state.$PanelActions.append(action)
  ComponentUid.set(state.$PanelHeader, 31)
  ViewletPanel.attachEvents(state)

  action.click()

  expectAction(31, 0, 'sample.run')
})

test('panel action handles a click on the icon', () => {
  const state = ViewletPanel.create()
  const firstAction = createAction('sample.first')
  const secondAction = createAction('sample.second')
  state.$PanelActions.append(firstAction, secondAction)
  ComponentUid.set(state.$PanelHeader, 32)
  ViewletPanel.attachEvents(state)

  const icon = secondAction.querySelector('.MaskIcon') as HTMLElement
  icon.click()

  expectAction(32, 1, 'sample.second')
})

test('panel action handles a click on a deeply nested icon element', () => {
  const state = ViewletPanel.create()
  const action = createAction('sample.deep')
  state.$PanelActions.append(action)
  ComponentUid.set(state.$PanelHeader, 33)
  ViewletPanel.attachEvents(state)

  const iconDecoration = action.querySelector('.MaskIconDecoration') as HTMLElement
  iconDecoration.click()

  expectAction(33, 0, 'sample.deep')
})

test('panel ignores an icon button without an action command', () => {
  const state = ViewletPanel.create()
  const action = createAction('sample.missing')
  delete action.dataset.command
  state.$PanelActions.append(action)
  ComponentUid.set(state.$PanelHeader, 34)
  ViewletPanel.attachEvents(state)

  const icon = action.querySelector('.MaskIcon') as HTMLElement
  icon.click()

  expect(RendererWorker.send).not.toHaveBeenCalled()
})
