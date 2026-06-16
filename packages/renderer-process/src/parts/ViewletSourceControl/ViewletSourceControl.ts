export * as Events from './ViewletSourceControlEvents.ts'

export const focus = (state) => {
  const { $Viewlet } = state
  $Viewlet.querySelector(':scope input').focus()
}
