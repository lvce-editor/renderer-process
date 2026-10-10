import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

const state = {
  hydrated: false,
  lastPathName: '',
}

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
  state.lastPathName = getPathName()
}

export const setHash = (hash: string) => {
  const currentHref = getHref()
  const url = new URL(currentHref)
  url.hash = hash.startsWith('#') ? hash.slice(1) : hash
  if (url.href === currentHref) {
    return
  }
  history.replaceState(null, '', url.href)
}

export const setWorkspaceUri = (_workspaceUri: string) => {
  const currentHref = getHref()
  const url = new URL(currentHref)
  url.searchParams.delete('workspace')
  if (url.href === currentHref) {
    return
  }
  history.replaceState(null, '', url.href)
}

export const removeWorkspaceUri = () => {
  const currentHref = getHref()
  const url = new URL(currentHref)
  if (!url.searchParams.has('workspace')) {
    return currentHref
  }
  url.searchParams.delete('workspace')
  history.replaceState(null, '', url.href)
  return getHref()
}

const isChatPath = (pathName: string): boolean => {
  return /(?:^|\/)chat\/?$/.test(pathName)
}

const handlePopState = () => {
  const pathName = getPathName()
  if (isChatPath(pathName)) {
    RendererWorker.send('Layout.enterAiNativeLayout')
  } else if (isChatPath(state.lastPathName)) {
    RendererWorker.send('Layout.leaveSideBarFocusMode')
  }
  state.lastPathName = pathName
}

export const hydrate = () => {
  if (state.hydrated) {
    return
  }
  state.lastPathName = getPathName()
  addEventListener('popstate', handlePopState)
  state.hydrated = true
}
