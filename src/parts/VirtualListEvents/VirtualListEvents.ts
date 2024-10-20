import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const handleWheel = (event) => {
  const { deltaMode, deltaY } = event
  const uid = ComponentUid.fromEvent(event)
  RendererWorker.send('EditorCompletion.handleWheel', uid, deltaMode, deltaY)
}
