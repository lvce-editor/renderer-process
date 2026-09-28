import { getViewletInstance } from '@lvce-editor/virtual-dom'
import * as IconButton from '../IconButton/IconButton.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'
import * as Widget from '../Widget/Widget.ts'

const state = {
  nextNotificationId: 0,
}

const pendingChoices = new WeakMap<Element, (choice: number | undefined) => void>()

const close = ($Notification: Element, choice?: number): void => {
  const resolve = pendingChoices.get($Notification)
  pendingChoices.delete($Notification)
  Widget.remove($Notification)
  resolve?.(choice)
}

const handleCloseClick = (event) => {
  const $CloseButton = event.currentTarget
  close($CloseButton.parentNode)
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
  $Notification.id = `Notification-${++state.nextNotificationId}`
  $Notification.className = 'Notification'
  $Notification.append($NotificationMessage, $CloseButton)
  return $Notification
}

export const create = (type, message, parentUid?: number) => {
  const $Parent = parentUid === undefined ? undefined : getViewletInstance(parentUid)?.state.$Viewlet
  if (parentUid !== undefined && !$Parent) {
    throw new Error(`Notification parent not found: ${parentUid}`)
  }
  const $Notification = create$Notification(message)
  if ($Parent) {
    $Notification.style.position = 'absolute'
    $Parent.append($Notification)
    return $Notification.id
  }
  Widget.append($Notification)
  return $Notification.id
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
  $Notification.id = `Notification-${++state.nextNotificationId}`
  $Notification.className = 'Notification'
  $Notification.append($NotificationMessage, $CloseButton, $NotificationOptions)
  $Notification.onclick = handleNotificationClick
  return $Notification
}

export const createWithOptions = (type, message, options) => {
  const $Notification = create$NotificationWithOptions(message, options)
  Widget.append($Notification)
  return $Notification.id
}

export const showWithOptions = (type: string, message: string, options: readonly string[]): Promise<number | undefined> => {
  const $Notification = create$NotificationWithOptions(message, options)
  return new Promise((resolve) => {
    pendingChoices.set($Notification, resolve)
    $Notification.onclick = (event): void => {
      const $Target = event.target
      if ($Target instanceof HTMLButtonElement && $Target.classList.contains('NotificationOption')) {
        close($Notification, findIndex($Target))
      }
    }
    Widget.append($Notification)
  })
}

export const dispose = (id: string) => {
  const $Notification = document.getElementById(id)
  if ($Notification?.classList.contains('Notification')) {
    close($Notification)
  }
}
