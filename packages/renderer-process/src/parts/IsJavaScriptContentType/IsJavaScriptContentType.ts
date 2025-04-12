const javaScriptContentTypes = ['application/javascript', 'text/javascript', 'application/javascript; charset=UTF-8']

export const isJavaScriptContentType = (contentType) => {
  return javaScriptContentTypes.includes(contentType)
}
