import * as ComponentUid from '../ComponentUid/ComponentUid.ts'
import * as Event from '../Event/Event.ts'
import * as ViewletExtensionDetailFunctions from './ViewletExtensionDetailFunctions.ts'

export const handleIconError = (event) => {
  const uid = ComponentUid.fromEvent(event)
  ViewletExtensionDetailFunctions.handleIconError(uid)
}

const isLink = ($Element) => {
  return $Element.nodeName === 'A'
}

const isImage = ($Element) => {
  return $Element.nodeName === 'IMG'
}

export const handleReadmeContextMenu = (event) => {
  Event.preventDefault(event)
  const { clientX, clientY, target } = event
  const uid = ComponentUid.fromEvent(event)
  const props = Object.create(null)
  if (isLink(target)) {
    props.isLink = true
    props.url = target.href
  } else if (isImage(target)) {
    props.isImage = true
    props.url = target.src
  }
  ViewletExtensionDetailFunctions.handleReadmeContextMenu(uid, clientX, clientY, props)
}
