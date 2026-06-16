import * as Location from '../Location/Location.ts'

export const getAbsoluteUrl = (relativePath, sourceUrl) => {
  if (sourceUrl.startsWith('/')) {
    const origin = Location.getOrigin()
    const absoluteSource = new URL(sourceUrl, origin)
    const absoluteUrl = new URL(relativePath, absoluteSource.href)
    return absoluteUrl.href
  }
  const absoluteUrl = new URL(relativePath, sourceUrl)
  return absoluteUrl.href
}
