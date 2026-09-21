export interface Snapshot {
  readonly id: number
  readonly instances: Readonly<Record<string, unknown>>
  readonly uids: readonly number[]
}

const state: { snapshot: Snapshot | undefined } = { snapshot: undefined }

export const get = (): Snapshot | undefined => state.snapshot
export const set = (value: Snapshot | undefined): void => {
  state.snapshot = value
}
