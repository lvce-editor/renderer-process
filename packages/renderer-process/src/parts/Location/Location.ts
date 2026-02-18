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
  if (a === b) {
    return true
  }
  if (a === '/' && b === '') {
    return true
  }
  if (a === '' && b === '/') {
    return true
  }
  return false
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
