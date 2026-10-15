/**
 * @jest-environment jsdom
 */
import { expect, test } from '@jest/globals'
import { setViewletInstance } from '@lvce-editor/virtual-dom'
import { getMenuViewport } from '../src/parts/MenuViewport/MenuViewport.ts'

test('uses the browser viewport for menus without a view owner', () => {
  expect(getMenuViewport()).toEqual({ x: 0, y: 0, width: window.innerWidth, height: window.innerHeight })
})

test('reads the owning workbench on every invocation, including after resize and page offsets', () => {
  const source = document.createElement('div')
  const preview = document.createElement('div')
  source.className = preview.className = 'Workbench'
  const owner = document.createElement('div')
  preview.append(owner)
  document.body.append(source, preview)
  setViewletInstance(902, { state: { $Viewlet: owner } })
  let bounds = { x: 700, y: 80, width: 600, height: 500 }
  preview.getBoundingClientRect = () => bounds as DOMRect
  try {
    expect(getMenuViewport(902)).toEqual(bounds)
    bounds = { x: 900, y: 120, width: 400, height: 460 }
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
