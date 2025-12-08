import * as Layout from '../Layout/Layout.ts'
import * as Location from '../Location/Location.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'

export const getInitData = () => {
  const initData = {
    Config: {
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
