import * as ViewletSize from '../ViewletSize/ViewletSize.ts'
import * as ViewletSizeClassName from '../ViewletSizeClassName/ViewletSizeClassName.ts'

export const getClassName = (size) => {
  switch (size) {
    case ViewletSize.Large:
      return ViewletSizeClassName.Large
    case ViewletSize.Normal:
      return ViewletSizeClassName.Normal
    case ViewletSize.Small:
      return ViewletSizeClassName.Small
    default:
      return ViewletSizeClassName.None
  }
}
