export interface EditorOnlyConfig {
  readonly content?: string
  readonly fontFamily?: string
  readonly fontSize?: number
  readonly fontWeight?: number
  readonly languageId?: string
  readonly letterSpacing?: number
  readonly lineNumbers?: boolean
  readonly rowHeight?: number
  readonly tabSize?: number
  readonly tokenizePath?: string
  readonly uri?: string
}

interface Config {
  readonly editorOnly?: EditorOnlyConfig
}

export const getEditorOnlyConfig = (): EditorOnlyConfig => {
  const configElement = document.getElementById('Config')
  if (!configElement?.textContent) {
    return {}
  }
  const config = JSON.parse(configElement.textContent) as Config
  return config.editorOnly || {}
}
