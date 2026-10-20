/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import { getViewletInstance, VirtualDomElements } from '@lvce-editor/virtual-dom'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'
jest.unstable_mockModule('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts', () => ({ executeViewletCommand: jest.fn() }))
const ExecuteViewletCommand = await import('../src/parts/ExecuteViewletCommand/ExecuteViewletCommand.ts')
const Viewlet = await import('../src/parts/Viewlet/Viewlet.ts')

const ownerUid = 901
const widgetUid = 902
const listeners = [
  { event: 'click', ignoreSelectors: ['.OwnerControl'], params: ['dismiss', false] },
  { event: 'focusout', ignoreSelectors: ['.OwnerControl'], params: ['dismiss', false] },
]
const renderWidget = () => {
  Viewlet.executeCommands([
    ['Viewlet.setDom2', widgetUid, [{ childCount: 0, className: 'WidgetContent', tabIndex: -1, type: VirtualDomElements.Div }]],
    ['Viewlet.registerOutsideEventListeners', widgetUid, ownerUid, listeners],
  ])
}

beforeEach(() => {
  for (const uid of [widgetUid, ownerUid]) {
    if (getViewletInstance(uid)) Viewlet.dispose(uid)
  }
  jest.clearAllMocks()
  document.body.replaceChildren()
  Viewlet.executeCommands([
    ['Viewlet.createFunctionalRoot', 'Owner', ownerUid, true],
    [
      'Viewlet.setDom2',
      ownerUid,
      [
        { childCount: 1, type: VirtualDomElements.Div },
        { childCount: 0, className: 'OwnerControl', type: VirtualDomElements.Button },
      ],
    ],
    ['Viewlet.appendToBody', ownerUid],
    ['Viewlet.createFunctionalRoot', 'Widget', widgetUid, true, undefined, ownerUid],
  ])
  renderWidget()
  Viewlet.executeCommands([['Viewlet.appendToBody', widgetUid]])
})

test('widget DOM keeps its owner as the event target across replacement', () => {
  expect(ComponentUid.get(getViewletInstance(widgetUid).state.$Viewlet)).toBe(ownerUid)
  renderWidget()
  expect(ComponentUid.get(getViewletInstance(widgetUid).state.$Viewlet)).toBe(ownerUid)
})

test('outside clicks target the owner once, ignoring its controls and widget descendants', () => {
  const notify = jest.mocked(ExecuteViewletCommand.executeViewletCommand)
  try {
    renderWidget()
    renderWidget()
    getViewletInstance(widgetUid).state.$Viewlet.click()
    document.querySelector<HTMLButtonElement>('.OwnerControl')!.click()
    expect(notify).not.toHaveBeenCalled()
    document.body.click()
    expect(notify).toHaveBeenCalledTimes(1)
    expect(notify).toHaveBeenCalledWith(ownerUid, 'dismiss', false)
    Viewlet.executeCommands([['Viewlet.dispose', widgetUid]])
    document.body.click()
    expect(notify).toHaveBeenCalledTimes(1)
  } finally {
    notify.mockClear()
  }
})

test('disposal cancels deferred focus notifications', async () => {
  const notify = jest.mocked(ExecuteViewletCommand.executeViewletCommand)
  try {
    const root = getViewletInstance(widgetUid).state.$Viewlet
    root.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    Viewlet.executeCommands([['Viewlet.dispose', widgetUid]])
    await Promise.resolve()
    expect(notify).not.toHaveBeenCalled()
  } finally {
    notify.mockClear()
  }
})

test('focus leaving the widget dismisses it after focus restoration has settled', async () => {
  const notify = jest.mocked(ExecuteViewletCommand.executeViewletCommand)
  try {
    const root = getViewletInstance(widgetUid).state.$Viewlet
    root.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    document.querySelector<HTMLButtonElement>('.OwnerControl')!.focus()
    await Promise.resolve()
    expect(notify).not.toHaveBeenCalled()
    root.dispatchEvent(new FocusEvent('focusout', { bubbles: true }))
    document.querySelector<HTMLButtonElement>('.OwnerControl')!.blur()
    await Promise.resolve()
    expect(notify).toHaveBeenCalledWith(ownerUid, 'dismiss', false)
  } finally {
    notify.mockClear()
  }
})
