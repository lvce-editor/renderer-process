export type ParsedSelectorPart =
  | {
      readonly selector: string
      readonly type: 'css'
    }
  | {
      readonly text: string
      readonly type: 'text'
    }
  | {
      readonly text: string
      readonly type: 'has-text'
    }
  | {
      readonly index: number
      readonly type: 'nth'
    }

export type ParsedCssSelector = readonly ParsedSelectorPart[]
