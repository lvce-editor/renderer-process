import * as VirtualDom from '@lvce-editor/virtual-dom'

export * from '@lvce-editor/virtual-dom'

type Renderer = {
  applyPatch: (element: Node, patches: readonly any[], eventMap?: any, id?: any) => void
  dispose: (root: HTMLElement) => void
  render: (nodes: readonly any[], eventMap?: any, newEventMap?: any) => HTMLElement
  renderInto: (parent: HTMLElement, nodes: readonly any[], eventMap?: any, newEventMap?: any) => void
}

const state: { renderer: Renderer | undefined } = {
  renderer: undefined,
}

export const configure = (options) => {
  const cache = options?.cache
  state.renderer = cache?.dom > 0 || cache?.text > 0 ? (VirtualDom.createRenderer(options) as unknown as Renderer) : undefined
}

export const render = (nodes: readonly any[], eventMap: any = {}, newEventMap: any = {}): HTMLElement => {
  return state.renderer?.render(nodes, eventMap, newEventMap) || VirtualDom.render(nodes, eventMap, newEventMap)
}

export const renderInto = (parent: HTMLElement, nodes: readonly any[], eventMap: any = {}, newEventMap: any = {}): void => {
  if (state.renderer) {
    state.renderer.renderInto(parent, nodes, eventMap, newEventMap)
    return
  }
  VirtualDom.renderInto(parent, nodes, eventMap)
}

export const applyPatch = (element: Node, patches: readonly any[], eventMap: any = {}, id: any = 0): void => {
  if (state.renderer) {
    state.renderer.applyPatch(element, patches, eventMap, id)
    return
  }
  VirtualDom.applyPatch(element, patches, eventMap, id)
}

export const dispose = (root: HTMLElement): void => {
  state.renderer?.dispose(root)
}
