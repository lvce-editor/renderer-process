import * as IconButton from '../IconButton/IconButton.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as Widget from '../Widget/Widget.ts'

const handleCloseClick = (event) => {
  const $CloseButton = event.currentTarget
  Widget.remove($CloseButton.parentNode)
}

const create$NotificationMessage = (message) => {
  const $NotificationMessage = document.createElement('p')
  $NotificationMessage.className = 'NotificationMessage'
  $NotificationMessage.textContent = message
  return $NotificationMessage
}

const create$CloseButton = () => {
  const $CloseButton = IconButton.create$Button('Close', 'Close')
  $CloseButton.classList.add('NotificationCloseButton')
  $CloseButton.onclick = handleCloseClick
  return $CloseButton
}

const create$Notification = (message) => {
  const $NotificationMessage = create$NotificationMessage(message)
  const $CloseButton = create$CloseButton()
  const $Notification = document.createElement('div')
  $Notification.className = 'Notification'
  $Notification.append($NotificationMessage, $CloseButton)
  return $Notification
}

export const create = (type, message) => {
  // TODO this pattern might be also useful for activitybar, sidebar etc., creating elements as late as possible, only when actually needed
  const $Notification = create$Notification(message)
  Widget.append($Notification)
}

const findIndex = ($Child) => {
  const $Parent = $Child.parentNode
  for (let i = 0; i < $Parent.children.length; i++) {
    if ($Parent.children[i] === $Child) {
      return i
    }
  }
  return -1
}

const handleNotificationClick = (event) => {
  const $Target = event.target
  switch ($Target.className) {
    case 'NotificationOption':
      const index = findIndex($Target)
      RendererWorker.send(/* Notification.handleClick */ 'Notification.handleClick', /* index */ index)
      break
    default:
      break
  }
}

const create$NotificationWithOptions = (message, options) => {
  const $NotificationMessage = create$NotificationMessage(message)
  const $CloseButton = create$CloseButton()
  const $NotificationOptions = document.createElement('div')
  $NotificationOptions.className = 'NotificationOptions'
  for (const option of options) {
    const $NotificationOption = document.createElement('button')
    $NotificationOption.className = 'NotificationOption'
    $NotificationOption.textContent = option
    $NotificationOptions.append($NotificationOption)
  }
  const $Notification = document.createElement('div')
  $Notification.className = 'Notification'
  $Notification.append($NotificationMessage, $CloseButton, $NotificationOptions)
  $Notification.onclick = handleNotificationClick
  return $Notification
}

export const createWithOptions = (type, message, options) => {
  const $Notification = create$NotificationWithOptions(message, options)
  Widget.append($Notification)
}

export const dispose = (id) => {
  // const $Notification = state.$Notifications
}
