import * as ContentSecurityPolicyErrorState from '../ContentSecurityPolicyErrorState/ContentSecurityPolicyErrorState.ts'

export const handleContentSecurityPolicyViolation = (event) => {
  const { columnNumber, lineNumber, sourceFile, violatedDirective } = event
  ContentSecurityPolicyErrorState.addError({
    columnNumber,
    lineNumber,
    sourceFile,
    violatedDirective,
  })
}
