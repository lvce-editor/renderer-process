/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, test } from '@jest/globals'
import { VirtualDomElements } from '@lvce-editor/virtual-dom'
import * as Layout from '../src/parts/Layout/Layout.ts'
import * as Viewlet from '../src/parts/Viewlet/Viewlet.ts'
import * as ViewletState from '../src/parts/ViewletState/ViewletState.ts'

beforeEach(() => {
  document.body.replaceChildren()
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
