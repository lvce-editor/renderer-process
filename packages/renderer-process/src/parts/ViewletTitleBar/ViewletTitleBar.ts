const activeClassName = 'TitleBarActive'

export const setFocused = (state, isFocused) => {
  const { $Viewlet } = state
  $Viewlet.classList.toggle(activeClassName, isFocused)
}

export * from '../ViewletTitleBarMenuBar/ViewletTitleBarMenuBar.ts'
