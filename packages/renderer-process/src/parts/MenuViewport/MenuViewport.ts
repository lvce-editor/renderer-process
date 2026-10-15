import { getViewletInstance } from '@lvce-editor/virtual-dom'

export const getMenuViewport = (uid?: number): { x: number; y: number; width: number; height: number } => {
  if (uid === undefined) {
    return { height: window.innerHeight, width: window.innerWidth, x: 0, y: 0 }
  }
  const element = getViewletInstance(uid)?.state.$Viewlet
  const workbench = element?.closest('.Workbench')
  if (!workbench) {
    throw new Error(`Menu owner workbench not found: ${uid}`)
  }
  const { height, width, x, y } = workbench.getBoundingClientRect()
  return { height, width, x, y }
}
