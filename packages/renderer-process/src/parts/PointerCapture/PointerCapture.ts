// workaround for not being setPointerCapture() not working on
// synthetic events
let originalSetPointerCapture
let originalReleasePointerCapture

export const mock = () => {
  originalSetPointerCapture = Element.prototype.setPointerCapture
  originalReleasePointerCapture = Element.prototype.releasePointerCapture

  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}

export const unmock = () => {
  Element.prototype.setPointerCapture = originalSetPointerCapture
  Element.prototype.releasePointerCapture = originalReleasePointerCapture
}
