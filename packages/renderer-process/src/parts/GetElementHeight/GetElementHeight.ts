export const getElementHeight = ($Element: HTMLElement) => {
  document.body.append($Element)
  const height = $Element.offsetHeight
  $Element.remove()
  return height
}
