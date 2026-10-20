import { getViewletInstance } from '@lvce-editor/virtual-dom'
import * as ExecuteViewletCommand from '../ExecuteViewletCommand/ExecuteViewletCommand.ts'

export interface OutsideEventListener {
  readonly event: 'click' | 'focusout'
  readonly ignoreSelectors: readonly string[]
  readonly params: readonly any[]
}

const cleanups = new Map<number, () => void>()

export const dispose = (uid: number): void => {
  cleanups.get(uid)?.()
  cleanups.delete(uid)
}

// The owner controls the lifetime; events can target the component owning a widget.
export const register = (uid: number, targetUid: number, listeners: readonly OutsideEventListener[]): void => {
  dispose(uid)
  const root = getViewletInstance(uid)?.state.$Viewlet
  if (!root) {
    return
  }
  let active = true
  const removals: (() => void)[] = []
  const isInside = (target: EventTarget | null, selectors: readonly string[]): boolean => {
    if (!(target instanceof Element)) {
      return false
    }
    if (getViewletInstance(uid)?.state.$Viewlet.contains(target)) {
      return true
    }
    const parentRoot = getViewletInstance(targetUid)?.state.$Viewlet
    return selectors.some((selector) => {
      const match = target.closest(selector)
      return match && parentRoot?.contains(match)
    })
  }
  for (const listener of listeners) {
    const { event, ignoreSelectors, params } = listener
    const notify = (target: EventTarget | null): void => {
      if (active && !isInside(target, ignoreSelectors)) {
        ExecuteViewletCommand.executeViewletCommand(targetUid, params[0], ...params.slice(1))
      }
    }
    const handleEvent = (event: Event): void => {
      if (event.type === 'focusout') {
        // DOM replacement can briefly clear focus before a following focus command.
        queueMicrotask(() => notify(document.activeElement))
      } else {
        notify(event.target)
      }
    }
    const target = event === 'focusout' ? root : document
    target.addEventListener(event, handleEvent)
    removals.push(() => target.removeEventListener(event, handleEvent))
  }
  cleanups.set(uid, () => {
    active = false
    for (const remove of removals) {
      remove()
    }
  })
}
