import type { ParsedCssSelector } from './ParsedCssSelector.ts'

interface LegacyLocator {
  readonly _parsed: ParsedCssSelector
}

export const getParsedSelector = (locator: ParsedCssSelector | LegacyLocator): ParsedCssSelector => {
  if (Array.isArray(locator)) {
    return locator
  }
  return (locator as LegacyLocator)._parsed
}
