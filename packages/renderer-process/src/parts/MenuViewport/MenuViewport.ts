import { getViewletInstance } from '@lvce-editor/virtual-dom'

export const getMenuViewport = (uid?: number): { x: number; y: number; width: number; height: number } => {
  if (uid === undefined) {
    return { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight }
  }
  const element = getViewletInstance(uid)?.state.$Viewlet
  const workbench = element?.closest('.Workbench')
  if (!workbench) {
    throw new Error(`Menu owner workbench not found: ${uid}`)
  }
  const { x, y, width, height } = workbench.getBoundingClientRect()
  return { x, y, width, height }
}
