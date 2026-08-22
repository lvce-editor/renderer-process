import type { Rpc } from '@lvce-editor/rpc'
import * as DragAndDropWorkerUrl from '../DragAndDropWorkerUrl/DragAndDropWorkerUrl.ts'
import * as LaunchWorker from '../LaunchWorker/LaunchWorker.ts'
import type * as Result from '../Result/Result.ts'

export const launchDragAndDropWorker = async (): Promise<Result.Result<Rpc>> => {
  return LaunchWorker.launchWorker({
    name: 'Drag And Drop Worker',
    url: DragAndDropWorkerUrl.dragAndDropWorkerUrl,
  })
}
