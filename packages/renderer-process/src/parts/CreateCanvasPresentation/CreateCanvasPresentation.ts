export const createCanvasPresentation = (
  canvas: HTMLCanvasElement,
  onDispose: () => void,
): { readonly dispose: () => void; readonly port: MessagePort } => {
  const { port1, port2 } = new MessageChannel()
  const context = canvas.getContext('bitmaprenderer')
  if (!context) {
    port1.close()
    port2.close()
    throw new Error('Canvas bitmap presentation is unavailable')
  }
  let disposed = false
  const dispose = (): void => {
    if (disposed) return
    disposed = true
    port1.onmessage = null
    port1.onmessageerror = null
    port1.close()
    onDispose()
  }
  port1.onmessageerror = (): void => {
    // Firefox can reject a transferred bitmap while decoding the message.
    // Release the sender's single frame slot so the next frame can recover.
    if (!disposed) port1.postMessage({ type: 'presented' })
  }
  port1.onmessage = (event): void => {
    const { bitmap, type } = event.data
    if (type === 'dispose') {
      dispose()
      return
    }
    if (type !== 'frame') return
    try {
      context.transferFromImageBitmap(bitmap)
    } finally {
      bitmap.close()
      port1.postMessage({ type: 'presented' })
    }
  }
  return { dispose, port: port2 }
}
