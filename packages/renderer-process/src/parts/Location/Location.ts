export const getOrigin = () => {
  return location.origin
}

export const getPathName = () => {
  return location.pathname
}

export const getHref = () => {
  return location.href
}

const matchesPathName = (a: string, b: string) => {
  return a === b || (a === '/' && b === '') || (a === '' && b === '/')
}

// TODO should do nothing if it is already at this path
export const setPathName = (pathName) => {
  const currentPathName = getPathName()
  if (matchesPathName(currentPathName, pathName)) {
    return
  }
  // @ts-expect-error
  history.pushState(null, null, pathName)
}

export const hydrate = () => {
  // addEventListener('popstate', handlePopState)
}
