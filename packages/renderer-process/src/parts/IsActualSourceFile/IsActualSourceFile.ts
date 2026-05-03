export const isActualSourceFile = (path) => {
  return !(
    path === '<anonymous>' ||
    path === 'debugger eval code' ||
    path.startsWith('"') ||
    path.startsWith(`'`) ||
    path.startsWith(')') ||
    path.startsWith('file://')
  )
}
