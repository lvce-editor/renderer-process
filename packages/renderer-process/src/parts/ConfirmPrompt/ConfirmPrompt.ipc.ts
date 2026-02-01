import * as ConfirmPrompt from './ConfirmPrompt.ts'

export const name = 'ConfirmPrompt'

export const Commands = {
  prompt: ConfirmPrompt.confirm, // TODO bad name
  prompt2: ConfirmPrompt.prompt2,
}
