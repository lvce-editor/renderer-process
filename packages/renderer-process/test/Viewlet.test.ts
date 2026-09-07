/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, jest, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom'
import * as ComponentUid from '../src/parts/ComponentUid/ComponentUid.ts'
import * as DirectViewRpcRegistry from '../src/parts/DirectViewRpcRegistry/DirectViewRpcRegistry.ts'
import * as Layout from '../src/parts/Layout/Layout.ts'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.ts'
import * as ViewletState from '../src/parts/ViewletState/ViewletState.ts'

beforeEach(() => {
  document.body.replaceChildren()
  DirectViewRpcRegistry.clear()
})

test('mounts two application layouts into independent roots', () => {
  const sourceRoot = document.createElement('div')
  sourceRoot.id = 'source-root'
  const previewRoot = document.createElement('div')
  previewRoot.id = 'preview-root'
  document.body.append(sourceRoot, previewRoot)

  Viewlet.executeCommands([
    ['Viewlet.createFunctionalRoot', 'Layout', 801, true],
    ['Viewlet.createFunctionalRoot', 'Layout', 802, true],
    ['Viewlet.appendToRoot', 801, 'source-root'],
    ['Viewlet.appendToRoot', 802, 'preview-root'],
  ])

  expect(sourceRoot.children).toHaveLength(1)
  expect(previewRoot.children).toHaveLength(1)
  expect(sourceRoot.firstElementChild).not.toBe(previewRoot.firstElementChild)
  expect(ComponentUid.get(sourceRoot.firstElementChild)).toBe(801)
  expect(ComponentUid.get(previewRoot.firstElementChild)).toBe(802)

  Viewlet.executeCommands([['Viewlet.dispose', 802]])
  expect(sourceRoot.children).toHaveLength(1)
  expect(previewRoot.children).toHaveLength(0)
})

test('rejects a missing application root without moving the viewlet', () => {
  Viewlet.executeCommands([
    ['Viewlet.createFunctionalRoot', 'Layout', 803, true],
    ['Viewlet.appendToBody', 803],
  ])
  const originalRoot = document.body.firstElementChild
  expect(() => Viewlet.executeCommands([['Viewlet.appendToRoot', 803, 'missing-root']])).toThrow('Application root not found')
  expect(document.body.firstElementChild).toBe(originalRoot)
})

test.skip('appendViewlet', async () => {
  // @ts-ignore
  await Viewlet.hydrate('SideBar', [])
  // @ts-ignore
  expect(Layout.state.$Sidebar.children).toHaveLength(2)
})

test.skip('appendViewlet - callbacks should be invoked', async () => {
  // @ts-ignore
  await Viewlet.hydrate('SideBar', [])
  Viewlet.invoke('Extensions', 'setExtensions', [])
  // @ts-ignore
  await Viewlet.appendViewlet('SideBar', 'Extensions')
  // @ts-ignore
  expect(ViewletState.state.instances.Sidebar.state.$Sidebar.textContent).toContain('ExtensionsNo extensions found.')
})

test('appendViewlet applies pending selector focus after mounting child viewlet', () => {
  let parentState
  ViewletState.state.modules.TestParent = {
    appendViewlet(state, name, $Viewlet) {
      state.$Viewlet.append($Viewlet)
    },
    create() {
      parentState = {
        $Viewlet: document.createElement('div'),
      }
      return parentState
    },
  }
  ViewletState.state.modules.TestEditor = {
    create() {
      const $Viewlet = document.createElement('div')
      $Viewlet.className = 'Viewlet Editor'
      $Viewlet.innerHTML = '<div class="EditorInput"><textarea name="editor"></textarea></div>'
      return {
        $Viewlet,
      }
    },
  }

  Viewlet.create('TestParent')
  Viewlet.create('TestEditor')
  document.body.append(parentState.$Viewlet)
  Viewlet.focusSelector('TestEditor', '.EditorInput textarea')
  Viewlet.appendViewlet('TestParent', 'TestEditor', false)

  expect(document.activeElement).toBe(document.querySelector('.EditorInput textarea'))
})

test('focusSelector focuses the viewlet root when it matches the selector', () => {
  let viewletState
  ViewletState.state.modules.TestFocusRoot = {
    create() {
      const $Viewlet = document.createElement('div')
      $Viewlet.id = 'TestFocusRoot'
      $Viewlet.tabIndex = 0
      viewletState = {
        $Viewlet,
      }
      return viewletState
    },
  }

  Viewlet.create('TestFocusRoot')
  document.body.append(viewletState.$Viewlet)
  Viewlet.focusSelector('TestFocusRoot', '#TestFocusRoot')

  expect(document.activeElement).toBe(viewletState.$Viewlet)
})

test('focusSelectorAfterRender focuses after two animation frames', () => {
  const callbacks: FrameRequestCallback[] = []
  let viewletState
  const originalRequestAnimationFrame = globalThis.requestAnimationFrame
  globalThis.requestAnimationFrame = (callback): number => {
    callbacks.push(callback)
    return callbacks.length
  }
  ViewletState.state.modules.TestDeferredFocus = {
    create() {
      const $Viewlet = document.createElement('div')
      $Viewlet.innerHTML = '<textarea name="deferred-focus"></textarea>'
      viewletState = {
        $Viewlet,
      }
      return viewletState
    },
  }

  Viewlet.create('TestDeferredFocus')
  document.body.append(viewletState.$Viewlet)
  const input = document.querySelector('[name="deferred-focus"]')

  Viewlet.focusSelectorAfterRender('TestDeferredFocus', '[name="deferred-focus"]')

  expect(document.activeElement).toBe(document.body)
  callbacks.shift()?.(0)
  expect(document.activeElement).toBe(document.body)
  callbacks.shift()?.(0)
  expect(document.activeElement).toBe(input)
  globalThis.requestAnimationFrame = originalRequestAnimationFrame
})

test('scrollSelectorIntoView reveals the matching element without changing focus', () => {
  const scrollIntoView = jest.fn()
  let viewletState
  ViewletState.state.modules.TestRevealSelector = {
    create() {
      const $Viewlet = document.createElement('div')
      const $Tab = document.createElement('div')
      $Tab.className = 'SelectedTab'
      Object.defineProperty($Tab, 'scrollIntoView', { value: scrollIntoView })
      $Viewlet.append($Tab)
      viewletState = {
        $Viewlet,
      }
      return viewletState
    },
  }

  Viewlet.create('TestRevealSelector')
  document.body.append(viewletState.$Viewlet)

  Viewlet.scrollSelectorIntoView('TestRevealSelector', '.SelectedTab')

  expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest', inline: 'nearest' })
  expect(document.activeElement).toBe(document.body)
})

test('scrollSelectorBy scrolls the matching element horizontally', () => {
  let viewletState
  ViewletState.state.modules.TestScrollSelector = {
    create() {
      const $Viewlet = document.createElement('div')
      $Viewlet.innerHTML = '<div class="Tabs"></div>'
      viewletState = {
        $Viewlet,
      }
      return viewletState
    },
  }

  Viewlet.create('TestScrollSelector')
  document.body.append(viewletState.$Viewlet)
  const tabs = document.querySelector<HTMLElement>('.Tabs')
  if (!tabs) {
    throw new Error('tabs not found')
  }
  tabs.scrollLeft = 25

  Viewlet.scrollSelectorBy('TestScrollSelector', '.Tabs', 75)

  expect(tabs.scrollLeft).toBe(100)
})

test('setDom2 preserves focused input state', () => {
  Object.defineProperty(globalThis, 'CSS', {
    configurable: true,
    value: {
      escape: (value: string) => value,
    },
  })
  const initialDom = [
    {
      childCount: 1,
      className: 'FindWidget',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'MultilineInputBox before',
      name: 'search-value',
      placeholder: 'Find',
      type: VirtualDomElements.TextArea,
    },
  ]
  const updatedDom = [
    {
      childCount: 1,
      className: 'FindWidget',
      type: VirtualDomElements.Div,
    },
    {
      childCount: 0,
      className: 'MultilineInputBox after',
      name: 'search-value',
      placeholder: 'Find in file',
      type: VirtualDomElements.TextArea,
    },
  ]

  Viewlet.executeCommands([
    ['Viewlet.createFunctionalRoot', 'TestFindWidget', 101, true],
    ['Viewlet.setDom2', 101, initialDom],
    ['Viewlet.appendToBody', 101],
  ])
  const input = document.querySelector<HTMLTextAreaElement>('[name="search-value"]')
  expect(input).not.toBeNull()
  input?.focus()
  input?.setRangeText('content')
  input?.setSelectionRange(3, 5)

  Viewlet.executeCommands([['Viewlet.setDom2', 101, updatedDom]])

  const updatedInput = document.querySelector<HTMLTextAreaElement>('[name="search-value"]')
  expect(updatedInput).toBe(input)
  expect(document.activeElement).toBe(updatedInput)
  expect(updatedInput?.value).toBe('content')
  expect(updatedInput?.selectionStart).toBe(3)
  expect(updatedInput?.selectionEnd).toBe(5)
  expect(updatedInput?.className).toBe('MultilineInputBox after')
  expect(updatedInput?.placeholder).toBe('Find in file')
})

test('getDragData returns the latest registered drag data', () => {
  const dragData = {
    items: [
      {
        data: 'file:///workspace/file.txt',
        type: 'text/uri-list',
      },
    ],
    label: '1',
  }

  Viewlet.executeCommands([['Viewlet.setDragData', 42, dragData]])

  expect(Viewlet.getDragData()).toBe(dragData)
})

test('executeCommands removes an adopted stylesheet', () => {
  // @ts-ignore
  globalThis.CSSStyleSheet = class {
    replaceSync() {}
  }
  document.adoptedStyleSheets = []

  Viewlet.executeCommands([
    ['Css.addCssStyleSheet', 'Css-Explorer', '.Explorer {}'],
    ['Css.removeCssStyleSheet', 'Css-Explorer'],
  ])

  expect(document.adoptedStyleSheets).toEqual([])
})

test('createFunctionalRoot registers and dispose removes its direct worker route', () => {
  const rpc = { dispose() {} }
  DirectViewRpcRegistry.registerRpc('Panel', rpc as never)

  Viewlet.createFunctionalRoot('TestPanel', 101, true, 'Panel')

  expect(DirectViewRpcRegistry.get(101)).toBe(rpc)
  Viewlet.dispose(101)
  expect(DirectViewRpcRegistry.get(101)).toBeUndefined()
})

test('sendMultiple commits queued viewlet commands at the marker position', () => {
  const parentUid = 1
  const uid = 202
  ViewletState.state.modules.TestDirectRenderParent = {
    create() {
      return {
        $Viewlet: document.createElement('div'),
      }
    },
  }
  const dom = [
    {
      childCount: 0,
      className: 'DirectRenderContent',
      text: 'ready',
      type: VirtualDomElements.Div,
    },
  ]
  const transactionId = Viewlet.queueCommands(uid, [['Viewlet.setDom2', uid, dom]])

  expect(document.querySelector('.DirectRenderContent')).toBeNull()

  Viewlet.sendMultiple([
    ['Viewlet.create', 'TestDirectRenderParent', parentUid],
    ['Viewlet.createFunctionalRoot', 'TestDirectRender', uid, true],
    ['Viewlet.append', parentUid, uid],
    ['Viewlet.commitPending', uid, transactionId],
    ['Viewlet.appendToBody', parentUid],
  ])

  const content = document.querySelector<HTMLElement>('.DirectRenderContent')
  expect(content).not.toBeNull()
  expect(ComponentUid.get(content)).toBe(uid)
})

const createComponentDomFixture = (uid: number): Element => {
  Viewlet.executeCommands([
    ['Viewlet.createFunctionalRoot', 'Layout', uid, true],
    ['Viewlet.appendToBody', uid],
    [
      'Viewlet.setDom2',
      uid,
      [
        { childCount: 1, className: 'Original', type: VirtualDomElements.Div },
        { childCount: 0, text: 'Original text', type: VirtualDomElements.Text },
      ],
    ],
  ])
  return document.body.firstElementChild!
}

const editedComponentDom = [{ childCount: 0, className: 'Edited', type: VirtualDomElements.Div }]

test('a single tree Add patch appends suggestions without replacing the browser or its focused input', () => {
  Viewlet.executeCommands([
    ['Viewlet.createFunctionalRoot', 'Layout', 910, true],
    ['Viewlet.appendToBody', 910],
    [
      'Viewlet.setDom2',
      910,
      [
        { childCount: 1, className: 'SimpleBrowser', type: VirtualDomElements.Div },
        { childCount: 0, name: 'simple-browser-address', type: VirtualDomElements.Input },
      ],
    ],
  ])
  const browser = document.body.firstElementChild!
  const input = browser.querySelector('input')!
  input.value = 'example'
  input.focus()
  input.setSelectionRange(2, 5)

  Viewlet.executeCommands([
    ['Viewlet.setTreePatches', 910, [{ type: 6, nodes: [{ childCount: 0, className: 'SimpleBrowserSuggestions', type: VirtualDomElements.Div }] }]],
  ])

  expect(document.body.firstElementChild).toBe(browser)
  expect(browser.querySelector('input')).toBe(input)
  expect(document.activeElement).toBe(input)
  expect(input.value).toBe('example')
  expect([input.selectionStart, input.selectionEnd]).toEqual([2, 5])
  expect(browser.lastElementChild!.className).toBe('SimpleBrowserSuggestions')
  Viewlet.dispose(910)
})

test('legacy single Add patches still initialize the complete viewlet root', () => {
  createComponentDomFixture(911)
  Viewlet.setPatches(911, [{ type: 6, nodes: [{ childCount: 0, className: 'Fresh', type: VirtualDomElements.Div }] }])

  expect(document.body.firstElementChild!.className).toBe('Fresh')
  Viewlet.dispose(911)
})

test('restores the original tree before applying incremental patches after structural DOM edits', () => {
  const original = createComponentDomFixture(901)
  Viewlet.setComponentDom(901, editedComponentDom)
  expect(document.body.firstElementChild!.className).toBe('Edited')
  expect(Viewlet.getComponentDom(901)).toEqual(editedComponentDom)
  expect(ComponentUid.get(document.body.firstElementChild)).toBe(901)
  expect(original.textContent).toBe('Original text')

  Viewlet.setPatches(901, [
    { index: 0, type: 7 },
    { type: 1, value: 'Updated text' },
  ])
  expect(document.body.firstElementChild).toBe(original)
  expect(original.textContent).toBe('Updated text')
  expect(Viewlet.getComponentDom(901)).toBeUndefined()
  Viewlet.dispose(901)
})

test('repeated edits and empty patches preserve the same original DOM', () => {
  const original = createComponentDomFixture(902)
  Viewlet.setComponentDom(902, editedComponentDom)
  Viewlet.setComponentDom(902, [{ ...editedComponentDom[0], className: 'EditedAgain' }])
  Viewlet.setPatches(902, [])
  expect(document.body.firstElementChild!.className).toBe('EditedAgain')
  Viewlet.setPatches(902, [
    { index: 0, type: 7 },
    { type: 1, value: 'Updated again' },
  ])
  expect(document.body.firstElementChild).toBe(original)
  expect(original.textContent).toBe('Updated again')
  Viewlet.dispose(902)
})

test('a full render discards the DOM preview and its baseline', () => {
  createComponentDomFixture(903)
  Viewlet.setComponentDom(903, editedComponentDom)
  Viewlet.executeCommands([['Viewlet.setDom2', 903, [{ ...editedComponentDom[0], className: 'Fresh' }]]])
  expect(document.body.firstElementChild!.className).toBe('Fresh')
  expect(Viewlet.getComponentDom(903)).toBeUndefined()
  Viewlet.dispose(903)
})

test('disposing a DOM preview removes the preview and releases the retained baseline', () => {
  const original = createComponentDomFixture(904)
  Viewlet.setComponentDom(904, editedComponentDom)
  Viewlet.dispose(904)
  expect(document.body.children).toHaveLength(0)
  expect(original.isConnected).toBe(false)
  expect(Viewlet.getComponentDom(904)).toBeUndefined()
})

test('parent previews restore child component references before incremental rendering', () => {
  createComponentDomFixture(905)
  Viewlet.executeCommands([
    ['Viewlet.createFunctionalRoot', 'Layout', 906, true],
    ['Viewlet.appendToBody', 906],
    [
      'Viewlet.setDom2',
      906,
      [
        { childCount: 1, className: 'Parent', type: VirtualDomElements.Div },
        { childCount: 0, type: VirtualDomElements.Reference, uid: 905 },
      ],
    ],
  ])
  const parent = document.body.firstElementChild!
  const child = parent.firstElementChild
  const dom = [
    { childCount: 1, className: 'ParentEdited', type: VirtualDomElements.Div },
    { childCount: 0, type: VirtualDomElements.Reference, uid: 905 },
  ]
  Viewlet.setComponentDom(906, dom)
  expect(document.body.firstElementChild!.firstElementChild).toBe(child)
  Viewlet.setComponentDom(906, dom)
  Viewlet.setPatches(906, [
    { index: 0, type: 7 },
    { index: 0, type: 7 },
    { type: 1, value: 'Child updated' },
  ])
  expect(document.body.firstElementChild).toBe(parent)
  expect(parent.firstElementChild).toBe(child)
  expect(parent.textContent).toBe('Child updated')
  Viewlet.dispose(905)
  Viewlet.dispose(906)
})

test('parent DOM previews preserve editor focus and selection through incremental rendering', () => {
  Viewlet.executeCommands([
    ['Viewlet.createFunctionalRoot', 'Layout', 907, true],
    [
      'Viewlet.setDom2',
      907,
      [
        { childCount: 1, type: VirtualDomElements.Div },
        { childCount: 0, name: 'editor', type: VirtualDomElements.Input, value: 'editing' },
      ],
    ],
    ['Viewlet.createFunctionalRoot', 'Layout', 908, true],
    ['Viewlet.appendToBody', 908],
    [
      'Viewlet.setDom2',
      908,
      [
        { childCount: 1, type: VirtualDomElements.Div },
        { childCount: 0, type: VirtualDomElements.Reference, uid: 907 },
      ],
    ],
  ])
  const input = document.querySelector('input')!
  input.focus()
  input.setSelectionRange(1, 3)
  const dom = [
    { childCount: 1, className: 'Preview', type: VirtualDomElements.Div },
    { childCount: 0, type: VirtualDomElements.Reference, uid: 907 },
  ]
  Viewlet.setComponentDom(908, dom)
  expect(document.activeElement).toBe(input)
  expect(input.selectionStart).toBe(1)
  expect(input.selectionEnd).toBe(3)
  Viewlet.setComponentDom(908, dom)
  expect(document.activeElement).toBe(input)
  Viewlet.setPatches(908, [{ key: 'className', type: 3, value: 'Rendered' }])
  expect(document.activeElement).toBe(input)
  expect(input.selectionStart).toBe(1)
  expect(input.selectionEnd).toBe(3)
  Viewlet.dispose(907)
  Viewlet.dispose(908)
})

test('setValueByName updates an owned toolbar input outside the view content', () => {
  const uid = 901
  Viewlet.createFunctionalRoot('Problems', uid, true)
  Viewlet.executeCommands([['Viewlet.appendToBody', uid]])

  const otherToolbar = document.createElement('div')
  const otherInput = document.createElement('input')
  otherInput.name = 'ProblemsInput'
  otherInput.value = 'other view'
  otherToolbar.append(otherInput)
  ComponentUid.set(otherToolbar, 902)

  const toolbar = document.createElement('div')
  const input = document.createElement('input')
  input.name = 'ProblemsInput'
  toolbar.append(input)
  ComponentUid.set(toolbar, uid)
  document.body.prepend(otherToolbar, toolbar)
  input.focus()

  for (const value of ['first', 'a/b ☃', '', 'restored']) {
    Viewlet.setValueByName(uid, 'ProblemsInput', value)
    expect(input.value).toBe(value)
    expect(otherInput.value).toBe('other view')
    expect(document.activeElement).toBe(input)
  }
})
