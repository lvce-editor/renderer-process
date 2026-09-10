import type * as SelectorType from '../SelectorType/SelectorType.ts'

type ParsedSelectorPart =
  | {
      readonly selector: string
      readonly type: typeof SelectorType.Css | 'css'
    }
  | {
      readonly text: string
      readonly type: typeof SelectorType.Text | 'text'
    }
  | {
      readonly text: string
      readonly type: typeof SelectorType.HasText | 'has-text'
    }
  | {
      readonly index: number
      readonly type: typeof SelectorType.Nth | 'nth'
    }

export type ParsedCssSelector = readonly ParsedSelectorPart[]
