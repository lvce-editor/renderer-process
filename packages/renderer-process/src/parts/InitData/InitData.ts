import * as Layout from '../Layout/Layout.ts'
import * as Location from '../Location/Location.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'

const getConfig = () => {
  const configElement = document.getElementById('Config')
  if (!configElement?.textContent) {
    return {}
  }
  return JSON.parse(configElement.textContent)
}

export const getInitData = () => {
  const initData = {
    Config: {
      ...getConfig(),
      shouldLaunchMultipleWorkers: ShouldLaunchMultipleWorkers.shouldLaunchMultipleWorkers,
    },
    Layout: {
      bounds: Layout.getBounds(),
    },
    Location: {
      href: Location.getHref(),
    },
  }
  return initData
}
