import * as WalkValue from '../WalkValue/WalkValue.ts'

export const getTransfer = (value: any) => {
  const transferrables = []
  WalkValue.walkValue(value, transferrables)
  return transferrables
}
