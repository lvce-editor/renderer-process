// TODO so many things in this file

import * as AttachEventsFunctional from '../AttachEventsFunctional/AttachEventsFunctional.ts'
import * as ClipBoardData from '../ClipBoardData/ClipBoardData.ts'
import * as DetachEvent from '../DetachEvent/DetachEvent.ts'
import * as DomEventType from '../DomEventType/DomEventType.ts'
import * as Event from '../Event/Event.ts'
import * as FunctionalPointerEvents from '../FunctionalPointerEvents/FunctionalPointerEvents.ts'
import * as GetModifierKey from '../GetModifierKey/GetModifierKey.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'
import * as PointerEvents from '../PointerEvents/PointerEvents.ts'
import * as TouchEvent from '../TouchEvent/TouchEvent.ts'

// TODO go back to edit mode after pressing escape so screenreaders can navigate https://stackoverflow.com/questions/53909477/how-to-handle-tabbing-for-accessibility-with-a-textarea-that-uses-the-tab-button

// TODO tree shake out mobile support when targeting electron -> less code -> less event listeners -> less memory -> less cpu

export const handleFocus = (event) => {
  return ['handleFocus']
}

export const handleMouseMove = (event) => {
  const { altKey, clientX, clientY } = event
  return ['handleMouseMove', clientX, clientY, altKey]
}

export const handleBlur = (event) => {
  // needed for save on blur
  // also needed to close completions on blur
  return ['handleBlur']
}

/**
 *
 * @param {InputEvent} event
 */
export const handleBeforeInput = (event) => {
  Event.preventDefault(event)
  const { data, inputType } = event
  return ['handleBeforeInput', inputType, data]
}

// TODO composition should be better supported,
// for example
// - gedit draws a line below the composed text
// - codemirror 6 also draws that line
// - codemirror 5 also draws that line
// - vscode does not draw a line, but displays characters during composition

export const handleCompositionStart = (event) => {
  const { data } = event
  return ['compositionStart', data]
}

export const handleCompositionUpdate = (event) => {
  const { data } = event
  return ['compositionUpdate', data]
}

export const handleCompositionEnd = (event) => {
  const { data } = event
  return ['compositionEnd', data]
}

export const handleCut = (event) => {
  Event.preventDefault(event)
  return ['cut']
}

const isRightClick = (event) => {
  return event.button === MouseEventType.RightClick
}

export const handleEditorPointerMove = (event) => {
  const { altKey, clientX, clientY } = event
  // TODO if/else should be in renderer worker
  if (altKey) {
    return ['moveRectangleSelectionPx', clientX, clientY]
  }
  return ['moveSelectionPx', clientX, clientY]
}

export const handleEditorLostPointerCapture = (event) => {
  const { target } = event
  DetachEvent.detachEvent(target, DomEventType.PointerMove, handleEditorPointerMove)
  DetachEvent.detachEvent(target, DomEventType.LostPointerCapture, handleEditorLostPointerCapture)
  return ['handlePointerCaptureLost']
}

export const handleEditorGotPointerCapture = () => {
  return []
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleEditorPointerDown = (event) => {
  const { pointerId, target } = event
  target.setPointerCapture(pointerId)
  AttachEventsFunctional.attachEventsFunctional(target, {
    [DomEventType.LostPointerCapture]: handleEditorLostPointerCapture,
    [DomEventType.PointerMove]: handleEditorPointerMove,
    returnValue: true,
  })
  return []
}

export const handleMouseDown = (event) => {
  if (isRightClick(event)) {
    return []
  }
  Event.preventDefault(event)
  const { clientX, clientY, detail } = event
  const modifier = GetModifierKey.getModifierKey(event)
  return ['handleMouseDown', modifier, clientX, clientY, detail]
}

// TODO figure out whether it is possible to register hover provider without mousemove
// mousemove handler is called very often and could slow down editor / drain battery

/**
 *
 * @param {WheelEvent} event
 */
export const handleWheel = (event) => {
  const { deltaMode, deltaX, deltaY } = event
  // event.preventDefault()
  // const state = EditorHelper.getStateFromEvent(event)
  // TODO send editor id
  return ['setDelta', deltaMode, deltaX, deltaY]
}

export const handlePaste = (event) => {
  Event.preventDefault(event)
  const { clipboardData } = event
  const text = ClipBoardData.getText(clipboardData)
  return ['paste', text]
}

export const handleScrollBarVerticalPointerDown = FunctionalPointerEvents.create(
  (event) => {
    const { clientY } = event
    return ['handleScrollBarVerticalPointerDown', clientY]
  },
  (event) => {
    const { clientY } = event
    return ['handleScrollBarVerticalMove', clientY]
  },
  () => {
    return []
  },
)

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarThumbHorizontalPointerMove = (event) => {
  const { clientX } = event
  return ['handleScrollBarHorizontalMove', clientX]
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarHorizontalPointerUp = (event) => {
  const { pointerId, target } = event
  PointerEvents.stopTracking(target, pointerId, handleScrollBarThumbHorizontalPointerMove, handleScrollBarHorizontalPointerUp)
  return []
}

/**
 *
 * @param {PointerEvent} event
 */
export const handleScrollBarHorizontalPointerDown = (event) => {
  const { clientX, pointerId, target } = event
  PointerEvents.startTracking(target, pointerId, handleScrollBarThumbHorizontalPointerMove, handleScrollBarHorizontalPointerUp)
  return ['handleScrollBarHorizontalPointerDown', clientX]
}

export const handleScrollBarContextMenu = (event) => {
  Event.preventDefault(event)
  Event.stopPropagation(event)
}

// TODO add touch cancel handler

// TODO use touch events for scrolling

export const handleTouchStart = (event) => {
  const touchEvent = TouchEvent.toSimpleTouchEvent(event)
  return ['handleTouchStart', touchEvent]
}

export const handleTouchMove = (event) => {
  const touchEvent = TouchEvent.toSimpleTouchEvent(event)
  return ['handleTouchMove', touchEvent]
}

export const handleTouchEnd = (event) => {
  if (event.cancelable) {
    Event.preventDefault(event)
  }
  const touchEvent = TouchEvent.toSimpleTouchEvent(event)
  return ['handleTouchEnd', touchEvent]
}

const getRangeFromSelection = (selection) => {
  if (!selection.anchorNode) {
    return undefined
  }
  const $StartToken = selection.anchorNode.parentNode
  const $EndToken = selection.focusNode.parentNode
  const $StartRow = $StartToken.parentNode
  const $EndRow = $EndToken.parentNode
  const $Rows = $StartRow.parentNode
  let startRowIndex = 0
  for (let i = 0; i < $Rows.children.length; i++) {
    if ($Rows.children[i] === $StartRow) {
      startRowIndex = i
      break
    }
  }
  let startColumnIndex = 0
  for (let i = 0; i < $StartRow.children.length; i++) {
    if ($StartRow.children[i] === $StartToken) {
      break
    }
    startColumnIndex += $StartRow.children[i].textContent.length
  }
  startColumnIndex += selection.anchorOffset
  let endRowIndex = 0
  for (let i = 0; i < $Rows.children.length; i++) {
    if ($Rows.children[i] === $EndRow) {
      endRowIndex = i
      break
    }
  }
  let endColumnIndex = 0
  for (let i = 0; i < $EndRow.children.length; i++) {
    if ($EndRow.children[i] === $EndToken) {
      break
    }
    endColumnIndex += $EndRow.children[i].textContent.length
  }
  endColumnIndex += selection.focusOffset
  return {
    endColumnIndex,
    endRowIndex,
    startColumnIndex,
    startRowIndex,
  }
}

export const handleContentEditableBeforeInput = (event) => {
  const selection = document.getSelection()
  const range = getRangeFromSelection(selection)
  if (!range) {
    console.error('[Editor] cannot handle input event without selection')
    return
  }
  return ['handleBeforeInputFromContentEditable', event.data || '', range]
}

export const handleNativeSelectionChange = (event) => {
  // if (state.shouldIgnoreSelectionChange) {
  //   state.shouldIgnoreSelectionChange = false
  //   return
  // }
  // const selection = document.getSelection()
  // const range = getRangeFromSelection(selection)
  // if (!range) {
  //   return
  // }
  // RendererWorker.send(
  //   /* EditorHandleNativeSelectionChange.editorHandleNativeSelectionChange */ 'Editor.handleNativeSelectionChange',
  //   /* range */ range
  // )
  return []
}

export const handleContextMenu = (event) => {
  Event.preventDefault(event)
  const { button, clientX, clientY } = event
  return ['handleContextMenu', button, clientX, clientY]
}

export const returnValue = true
