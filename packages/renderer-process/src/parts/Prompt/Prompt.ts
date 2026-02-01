import * as Assert from '../Assert/Assert.ts'

export const prompt = (message: string, defaultValue: string): string | null => {
  Assert.string(message)
  return window.prompt(message, defaultValue)
}
