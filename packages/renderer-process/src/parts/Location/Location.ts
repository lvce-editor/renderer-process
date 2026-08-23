export const getOrigin = () => {
  return location.origin
}

export const getPathName = () => {
  return location.pathname
}

export const getHref = () => {
  return location.href
}

const matchesPathName = (currentPathName: string, pathName: string) => {
  const resolvedPathName = new URL(pathName, getHref()).pathname
  return currentPathName === resolvedPathName
}

export const setPathName = (pathName: string) => {
  const currentPathName = getPathName()
  if (matchesPathName(currentPathName, pathName)) {
    return
  }
  history.pushState(null, '', pathName)
}

export const setWorkspaceUri = (workspaceUri: string) => {
  const currentHref = getHref()
  const url = new URL(currentHref)
  url.searchParams.set('workspace', workspaceUri)
  if (url.href === currentHref) {
    return
  }
  history.replaceState(null, '', url.href)
}

export const hydrate = () => {
  // addEventListener('popstate', handlePopState)
}
