import * as Assert from '../Assert/Assert.ts'
import * as ViewletSearchEvents from './ViewletSearchEvents.ts'

export const focus = (state) => {
  Assert.object(state)
  state.$ViewletSearchInput.focus()
}

export const setValue = (state, value, key) => {
  if (key) {
    const $Element = state.$Viewlet.querySelector(key)
    if ($Element) {
      $Element.value = value
    }
    return
  }
  const { $ViewletSearchInput } = state
  $ViewletSearchInput.value = value
}

export const setFocus = (state, selector) => {
  if (!selector) {
    return
  }
  const { $Viewlet } = state
  const $Element = $Viewlet.querySelector(selector)
  if ($Element) {
    $Element.focus()
  }
}

export const dispose = () => {}

export * from '../ViewletScrollable/ViewletScrollable.ts'

export const Events = ViewletSearchEvents
