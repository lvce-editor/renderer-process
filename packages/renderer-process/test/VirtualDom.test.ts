import { expect, jest, test } from '@jest/globals'

const createRenderer = jest.fn()
const render = jest.fn()
const renderInto = jest.fn()
const applyPatch = jest.fn()
const dispose = jest.fn()
const configuredRenderer = {
  applyPatch,
  dispose,
  render,
  renderInto,
}

jest.unstable_mockModule('@lvce-editor/virtual-dom', () => ({
  applyPatch: jest.fn(),
  createRenderer,
  render: jest.fn(),
  renderInto: jest.fn(),
}))

const VirtualDom = await import('../src/parts/VirtualDom/VirtualDom.ts')
const VirtualDomPackage = await import('@lvce-editor/virtual-dom')

test('keeps the default renderer unchanged when recycling is disabled', () => {
  VirtualDom.configure({ cache: { dom: 0, text: 0 } })

  VirtualDom.render([])

  expect(createRenderer).not.toHaveBeenCalled()
  expect(VirtualDomPackage.render).toHaveBeenCalledWith([], {}, {})
})

test('uses all configured renderer operations', () => {
  createRenderer.mockReturnValue(configuredRenderer)
  VirtualDom.configure({ cache: { dom: 10, text: 10 } })

  VirtualDom.render(['render'])
  VirtualDom.renderInto('parent' as any, ['renderInto'])
  VirtualDom.applyPatch('element' as any, ['patch'])
  VirtualDom.dispose('root' as any)

  expect(createRenderer).toHaveBeenCalledWith({ cache: { dom: 10, text: 10 } })
  expect(render).toHaveBeenCalledWith(['render'], {}, {})
  expect(renderInto).toHaveBeenCalledWith('parent', ['renderInto'], {}, {})
  expect(applyPatch).toHaveBeenCalledWith('element', ['patch'], {}, 0)
  expect(dispose).toHaveBeenCalledWith('root')
})
