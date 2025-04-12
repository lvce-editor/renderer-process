export const transferrables: any[] = []

if (typeof MessagePort !== 'undefined') {
  transferrables.push(MessagePort)
}

if (typeof OffscreenCanvas !== 'undefined') {
  transferrables.push(OffscreenCanvas)
}
