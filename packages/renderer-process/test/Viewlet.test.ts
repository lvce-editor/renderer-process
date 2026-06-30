/**
 * @jest-environment jsdom
 */
import { beforeEach, expect, test } from '@jest/globals'
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
    create() {
      parentState = {
        $Viewlet: document.createElement('div'),
      }
      return parentState
    },
    appendViewlet(state, name, $Viewlet) {
      state.$Viewlet.append($Viewlet)
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
