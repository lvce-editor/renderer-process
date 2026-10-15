/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import { setViewletInstance } from '@lvce-editor/virtual-dom'
import { getMenuViewport } from '../src/parts/MenuViewport/MenuViewport.ts'

test('uses the browser viewport for menus without a view owner', () => {
  expect(getMenuViewport()).toEqual({ height: window.innerHeight, width: window.innerWidth, x: 0, y: 0 })
})

test('reads the owning workbench on every invocation, including after resize and page offsets', () => {
  const source = document.createElement('div')
  const preview = document.createElement('div')
  source.className = preview.className = 'Workbench'
  const owner = document.createElement('div')
  preview.append(owner)
  document.body.append(source, preview)
  setViewletInstance(902, { state: { $Viewlet: owner } })
  let bounds = { height: 500, width: 600, x: 700, y: 80 }
  preview.getBoundingClientRect = () => bounds as DOMRect
  try {
    expect(getMenuViewport(902)).toEqual(bounds)
    bounds = { height: 460, width: 400, x: 900, y: 120 }
    expect(getMenuViewport(902)).toEqual(bounds)
  } finally {
    source.remove()
    preview.remove()
    setViewletInstance(902, undefined)
  }
})

test('rejects an unknown owner instead of using another application viewport', () => {
  expect(() => getMenuViewport(903)).toThrow('Menu owner workbench not found: 903')
})
