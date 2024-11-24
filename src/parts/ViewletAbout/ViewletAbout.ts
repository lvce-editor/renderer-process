export const setFocused = (state, selector) => {
  if (selector === true) {
    selector = 'button'
  }
  if (!selector) {
    return
  }
  const { $Viewlet } = state
  const $Focusable = $Viewlet.querySelector(selector)
  $Focusable.focus()
}

export const Events = {}
