interface CanvasRectangle {
  readonly className: string
  readonly height: number
  readonly width: number
  readonly x: number
  readonly y: number
}

const getColor = ($Parent: HTMLElement, className: string): string => {
  const $Probe = document.createElement('span')
  $Probe.className = className
  $Probe.hidden = true
  $Parent.append($Probe)
  const color = getComputedStyle($Probe).color
  $Probe.remove()
  return color
}

const getColors = ($Parent: HTMLElement, rectangles: readonly CanvasRectangle[]): Map<string, string> => {
  const colors = new Map<string, string>()
  for (const rectangle of rectangles) {
    if (!colors.has(rectangle.className)) {
      colors.set(rectangle.className, getColor($Parent, rectangle.className))
    }
  }
  return colors
}

const getOrCreateCanvas = ($Parent: HTMLElement, className: string): HTMLCanvasElement => {
  const existing = $Parent.querySelector<HTMLCanvasElement>(`:scope > canvas.${className}`)
  if (existing) {
    return existing
  }
  const $Canvas = document.createElement('canvas')
  $Canvas.className = className
  $Canvas.ariaHidden = 'true'
  $Parent.append($Canvas)
  return $Canvas
}

export const renderCanvas = (
  $Viewlet: HTMLElement,
  selector: string,
  canvasClassName: string,
  width: number,
  height: number,
  rectangles: readonly CanvasRectangle[],
  revision: string,
): void => {
  const $Parent = $Viewlet.matches(selector) ? $Viewlet : $Viewlet.querySelector<HTMLElement>(selector)
  if (!$Parent) {
    return
  }
  const $Canvas = getOrCreateCanvas($Parent, canvasClassName)
  const devicePixelRatio = globalThis.devicePixelRatio || 1
  $Canvas.width = Math.round(width * devicePixelRatio)
  $Canvas.height = Math.round(height * devicePixelRatio)
  $Canvas.style.width = `${width}px`
  $Canvas.style.height = `${height}px`
  $Canvas.dataset.renderRevision = revision
  $Canvas.dataset.rectangleCount = String(rectangles.length)
  const context = $Canvas.getContext('2d')
  if (!context) {
    return
  }
  context.resetTransform()
  context.clearRect(0, 0, $Canvas.width, $Canvas.height)
  context.scale(devicePixelRatio, devicePixelRatio)
  const colors = getColors($Parent, rectangles)
  for (const rectangle of rectangles) {
    context.fillStyle = colors.get(rectangle.className) || 'currentColor'
    context.fillRect(rectangle.x, rectangle.y, rectangle.width, rectangle.height)
  }
}
