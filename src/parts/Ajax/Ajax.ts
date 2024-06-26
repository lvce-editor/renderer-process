import * as Assert from '../Assert/Assert.ts'
import * as LoadKy from '../LoadKy/LoadKy.ts'
import { VError } from '../VError/VError.ts'

export const getJson = async (url, options = {}) => {
  const { default: ky, HTTPError } = await LoadKy.loadKy()
  try {
    Assert.string(url)
    // cannot use ky(url).json() because it sets "accept: application/json"
    // which doesn't work with preload, see
    // https://stackoverflow.com/questions/41655955/why-are-preload-link-not-working-for-json-requests#answer-48645748
    const response = await ky(url, options)
    return response.json()
  } catch (error) {
    if (error && error instanceof TypeError && error.message === 'Failed to fetch') {
      // @ts-expect-error
      throw new VError(`Failed to request json from "${url}". Make sure that the server is running and has CORS enabled`)
    }
    if (error && error instanceof HTTPError) {
      let json
      try {
        // @ts-ignore
        json = await error.response.json()
      } catch {
        throw error
      }
      if (json?.message) {
        // @ts-expect-error
        throw new VError(`Failed to request json from "${url}": ${json.message}`)
      }
    }
    // @ts-ignore
    error.message = `Failed to request json from "${url}": ${error.message}`
    throw error
  }
}


export const getText = async (url, options = {}) => {
  try {
    const { default: ky } = await LoadKy.loadKy()
    return await ky(url, options).text()
  } catch (error) {
    if (error && error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new VError(error, `Failed to request text from "${url}". Make sure that the server is running and has CORS enabled`)
    }
    throw new VError(error, `Failed to request text from "${url}"`)
  }
}
