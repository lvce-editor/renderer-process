interface Listener {
  readonly params?: readonly unknown[]
}

interface WheelCommands {
  readonly commands: ReadonlyMap<unknown, readonly number[]>
  speed: number
}

const views = new Map<number, WheelCommands>()

const normalize = (value: unknown): number => (typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 3 ? value : 1)

export const register = (uid: number, listeners: readonly Listener[], speed: unknown = 1): void => {
  const commands = new Map<unknown, readonly number[]>()
  for (const { params = [] } of listeners) {
    const indices: number[] = []
    for (let i = 1; i < params.length; i++) {
      if (params[i] === 'event.deltaX' || params[i] === 'event.deltaY') indices.push(i)
    }
    if (indices.length > 0) commands.set(params[0], indices)
  }
  views.delete(uid)
  if (commands.size > 0) views.set(uid, { commands, speed: normalize(speed) })
}

export const set = (uid: number, speed: unknown): void => {
  const view = views.get(uid)
  if (view) view.speed = normalize(speed)
}

export const apply = (uid: number, args: readonly any[]): readonly any[] => {
  const view = views.get(uid)
  const indices = view?.commands.get(args[0])
  if (!view || view.speed === 1 || !indices) return args
  const scaled = [...args]
  for (const index of indices) scaled[index] *= view.speed
  return scaled
}

export const dispose = (uid: number): void => {
  views.delete(uid)
}
