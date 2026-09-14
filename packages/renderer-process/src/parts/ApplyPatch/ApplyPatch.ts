import * as VirtualDom from '../VirtualDom/VirtualDom.ts'

export const applyPatch = (element: Node, patches: readonly any[], eventMap: any = {}, id: any = 0): void => {
  VirtualDom.applyPatch(element, patches, eventMap, id)
}
