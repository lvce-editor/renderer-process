export type ParsedCssSelector =
  | {
      readonly text: string
      readonly type: 'text'
    }
  | {
      readonly selector: string
      readonly type: 'css'
    }
  | {
      readonly selector: string
      readonly text: string
      readonly type: 'css+text'
    }
