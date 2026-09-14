import * as VirtualDom from '@lvce-editor/virtual-dom'

export * from '@lvce-editor/virtual-dom'

let renderer

export const configure = (options) => {
  const cache = options?.cache
  renderer = cache?.dom > 0 || cache?.text > 0 ? VirtualDom.createRenderer(options) : undefined
}

export const render = (nodes: readonly any[], eventMap: any = {}, newEventMap: any = {}): HTMLElement => {
  return renderer?.render(nodes, eventMap, newEventMap) || VirtualDom.render(nodes, eventMap, newEventMap)
}

export const renderInto = (parent: HTMLElement, nodes: readonly any[], eventMap: any = {}, newEventMap: any = {}): void => {
  if (renderer) {
    renderer.renderInto(parent, nodes, eventMap, newEventMap)
    return
  }
  VirtualDom.renderInto(parent, nodes, eventMap)
}

export const applyPatch = (element: Node, patches: readonly any[], eventMap: any = {}, id: any = 0): void => {
  if (renderer) {
    renderer.applyPatch(element, patches, eventMap, id)
    return
  }
  VirtualDom.applyPatch(element, patches, eventMap, id)
}

export const dispose = (root: HTMLElement): void => {
  renderer?.dispose(root)
}
