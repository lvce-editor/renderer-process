import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const handleContinue = () => {
  RendererWorker.send('Run And Debug.continue')
}

export const pause = () => {
  RendererWorker.send('Run And Debug.pause')
}

export const stepOver = () => {
  RendererWorker.send('Run And Debug.stepOver')
}

export const stepInto = () => {
  RendererWorker.send('Run And Debug.stepInto')
}

export const stepOut = () => {
  RendererWorker.send('Run And Debug.stepOut')
}

export const handleClickSectionWatch = () => {
  RendererWorker.send('Run And Debug.handleClickSectionWatch')
}

export const handleClickSectionBreakpoints = () => {
  RendererWorker.send('Run And Debug.handleClickSectionBreakPoints')
}

export const handleClickSectionScope = () => {
  RendererWorker.send('Run And Debug.handleClickSectionScope')
}

export const handleClickSectionCallstack = () => {
  RendererWorker.send('Run And Debug.handleClickSectionCallstack')
}

export const handleClickSectionBreakPoints = () => {
  RendererWorker.send('Run And Debug.handleClickSectionBreakPoints')
}

export const handleClickScopeValue = (text) => {
  RendererWorker.send('Run And Debug.handleClickScopeValue', text)
}

export const handleClickSectionHeading = (text) => {
  RendererWorker.send('Run And Debug.handleClickSectionHeading', text)
}

export const handleClickCheckBox = (text) => {
  RendererWorker.send('Run And Debug.handleClickCheckBox', text)
}

/**
 *
 * @param {string} value
 */
export const handleDebugInput = (value) => {
  RendererWorker.send('Run And Debug.handleDebugInput', value)
}
