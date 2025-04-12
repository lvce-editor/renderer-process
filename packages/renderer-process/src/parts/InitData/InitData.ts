import * as Layout from '../Layout/Layout.ts'
import * as Location from '../Location/Location.ts'
import * as ShouldLaunchMultipleWorkers from '../ShouldLaunchMultipleWorkers/ShouldLaunchMultipleWorkers.ts'

export const getInitData = () => {
  const initData = {
    Location: {
      href: Location.getHref(),
    },
    Layout: {
      bounds: Layout.getBounds(),
    },
    Config: {
      shouldLaunchMultipleWorkers: ShouldLaunchMultipleWorkers.shouldLaunchMultipleWorkers,
    },
  }
  return initData
}
