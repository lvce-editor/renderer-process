import * as Assert from '../Assert/Assert.ts'
import * as ViewletEventRouter from '../ViewletEventRouter/ViewletEventRouter.ts'

export const executeViewletCommand = (uid, command, ...args) => {
  Assert.number(uid)
  ViewletEventRouter.send('Viewlet.executeViewletCommand', uid, command, ...args)
}
