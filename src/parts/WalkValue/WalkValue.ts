import * as IsTransferrable from '../IsTransferrable/IsTransferrable.ts'

export const walkValue = (value: unknown, transferrables: unknown[]) => {
  if (!value) {
    return
  }
  if (IsTransferrable.isTransferrable(value)) {
    transferrables.push(value)
  }
  if (Array.isArray(value)) {
    for (const item of value) {
      walkValue(item, transferrables)
    }
    return
  }
  if (typeof value === 'object') {
    for (const property of Object.values(value)) {
      walkValue(property, transferrables)
    }
  }
}
