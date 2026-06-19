// workaround for not being setPointerCapture() not working on
// synthetic events
const originalPointerCapture: {
  releasePointerCapture?: typeof Element.prototype.releasePointerCapture
  setPointerCapture?: typeof Element.prototype.setPointerCapture
} = {}

export const mock = () => {
  originalPointerCapture.setPointerCapture = Element.prototype.setPointerCapture
  originalPointerCapture.releasePointerCapture = Element.prototype.releasePointerCapture

  Element.prototype.setPointerCapture = () => {}
  Element.prototype.releasePointerCapture = () => {}
}

export const unmock = () => {
  Element.prototype.setPointerCapture = originalPointerCapture.setPointerCapture!
  Element.prototype.releasePointerCapture = originalPointerCapture.releasePointerCapture!
}
