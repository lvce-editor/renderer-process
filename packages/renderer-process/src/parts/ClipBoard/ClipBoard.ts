import * as Assert from '../Assert/Assert.ts'

export const readText = async () => {
  return navigator.clipboard.readText()
}

const normalizeItems = async (items: readonly ClipboardItem[]): Promise<readonly any[]> => {
  const normalized: any[] = []
  for (const clipboardItem of items) {
    for (const type of clipboardItem.types) {
      if (!type.startsWith('web ')) {
        continue
      }
      const blob = await clipboardItem.getType(type)
      normalized.push({
        blob,
        type,
      })
    }
  }
  return normalized
}

export const read = async () => {
  const items = await navigator.clipboard.read()
  const normalized = normalizeItems(items)
  return normalized
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
