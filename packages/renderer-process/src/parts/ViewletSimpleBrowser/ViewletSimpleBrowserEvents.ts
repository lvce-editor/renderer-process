import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'
import * as ViewletSimpleBrowserFunctions from './ViewletSimpleBrowserFunctions.ts'

const simpleBrowserAddressName = 'simple-browser-address'

export const handleInput = (event) => {
  const { target } = event
  const { value } = target
  ViewletSimpleBrowserFunctions.handleInput(value)
}

export const handleClickSuggestion = (event): void => {
  const suggestion = event.target.closest?.('.SimpleBrowserSuggestion')
  const value = suggestion?.dataset.value
  if (typeof value !== 'string') {
    return
  }
  ViewletSimpleBrowserFunctions.acceptSuggestion(value)
}

export const handleFocus = (event) => {
  const { target } = event
  RendererWorker.send('Focus.setFocus', WhenExpression.FocusSimpleBrowserInput)
  setTimeout(() => {
    const suggestions = target.closest('.SimpleBrowser')?.querySelector('.SimpleBrowserSuggestions')
    if (suggestions) {
      target.setSelectionRange(target.value.length, target.value.length)
      return
    }
    target.select()
  })
}

export const handleBlur = (event) => {
  const { relatedTarget, target } = event
  setTimeout(() => {
    if (!target.isConnected) {
      return
    }
    if (target.ownerDocument.activeElement?.getAttribute('name') === simpleBrowserAddressName) {
      return
    }
    target.setSelectionRange(0, 0)
    if (!relatedTarget?.closest?.('.SimpleBrowserSuggestions')) {
      ViewletSimpleBrowserFunctions.closeSuggestions()
    }
  })
}

export const handleClickForward = () => {
  ViewletSimpleBrowserFunctions.forward()
}

export const handleClickBackward = () => {
  ViewletSimpleBrowserFunctions.backward()
}

export const handleClickReload = (event) => {
  const { target } = event
  // TODO maybe set data attribute to check if it is a cancel button
  // TODO do checks in renderer worker
  if (target.title === 'Cancel') {
    ViewletSimpleBrowserFunctions.cancelNavigation()
  } else {
    ViewletSimpleBrowserFunctions.reload()
  }
}

export const handleClickOpenExternal = () => {
  ViewletSimpleBrowserFunctions.openExternal()
}
