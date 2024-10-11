import * as ComponentUid from '../ComponentUid/ComponentUid.ts'

export const applyUidWorkaround = (element: HTMLElement) => {
  // TODO editor widget uids are not available in renderer worker
  // TODO send editor events directly to editor worker
  const editor = document.querySelector('.Viewlet.Editor') as HTMLElement
  if (!editor) {
    throw new Error('no editor found')
  }
  const editorUid = ComponentUid.get(editor)
  ComponentUid.set(element, editorUid)
}
