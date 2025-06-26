import * as Assert from '../Assert/Assert.ts'

export const readText = async () => {
  return navigator.clipboard.readText()
}

export const writeText = async (text) => {
  Assert.string(text)
  await navigator.clipboard.writeText(text)
}

const toClipBoardItem = (options: any): ClipboardItem => {
  return new ClipboardItem(options)
}

export const write = async (itemOptions: readonly any[]): Promise<void> => {
  const items = itemOptions.map(toClipBoardItem)
  await navigator.clipboard.write(items)
}

export const writeImage = async (blob) => {
  await navigator.clipboard.write([new ClipboardItem({ [blob.type]: blob })])
}

export const execCopy = async () => {
  // @ts-expect-error
  const text = getSelection().toString()
  await writeText(text)
}
