/**
 * @jest-environment jsdom
 */
import { beforeAll, beforeEach, expect, jest, test } from '@jest/globals'

const terminalInstances: MockTerminal[] = []
const fitAddonInstances: MockFitAddon[] = []
const resizeObserverInstances: MockResizeObserver[] = []
const handleInput = jest.fn()
const resize = jest.fn()

class MockDisposable {
  public disposed = false

  dispose() {
    this.disposed = true
  }
}

class MockFitAddon {
  public fitCalls = 0

  constructor() {
    fitAddonInstances.push(this)
  }

  fit() {
    this.fitCalls++
  }
}

class MockResizeObserver {
  public disconnected = false
  public observed: Element[] = []

  constructor(public callback: ResizeObserverCallback) {
    resizeObserverInstances.push(this)
  }

  observe(element: Element) {
    this.observed.push(element)
  }

  disconnect() {
    this.disconnected = true
  }
}

class MockTerminal {
  public addons: any[] = []
  public dataDisposable = new MockDisposable()
  public dataListener = (_data: string) => {}
  public disposed = false
  public focused = false
  public opened: HTMLElement | undefined
  public resizeDisposable = new MockDisposable()
  public resizeListener = (_event: { cols: number; rows: number }) => {}
  public written: any[] = []

  constructor(public options: any) {
    terminalInstances.push(this)
  }

  loadAddon(addon) {
    this.addons.push(addon)
  }

  onData(listener) {
    this.dataListener = listener
    return this.dataDisposable
  }

  onResize(listener) {
    this.resizeListener = listener
    return this.resizeDisposable
  }

  open(element) {
    this.opened = element
  }

  write(data) {
    this.written.push(data)
  }

  focus() {
    this.focused = true
  }

  dispose() {
    this.disposed = true
  }
}

beforeAll(() => {
  // @ts-ignore
  globalThis.ResizeObserver = MockResizeObserver
})

beforeEach(() => {
  terminalInstances.length = 0
  fitAddonInstances.length = 0
  resizeObserverInstances.length = 0
  handleInput.mockClear()
  resize.mockClear()
})

jest.unstable_mockModule('@xterm/addon-fit', () => {
  return {
    FitAddon: MockFitAddon,
  }
})

jest.unstable_mockModule('@xterm/xterm', () => {
  return {
    Terminal: MockTerminal,
  }
})

jest.unstable_mockModule('../src/parts/ForwardCommand/ForwardCommand.ts', () => {
  return {
    handleInput,
    resize,
  }
})

const ViewletTerminal2 = await import('../src/parts/ViewletTerminal2/ViewletTerminal2.ts')

test('create', () => {
  const state = ViewletTerminal2.create()
  expect(state.$Viewlet.className).toBe('Viewlet Terminal XtermTerminal')
  expect(state.pendingData).toEqual([])
  expect(state.terminal).toBeUndefined()
})

test('setTerminal mounts and fits xterm', async () => {
  const state = ViewletTerminal2.create()
  await ViewletTerminal2.setTerminal(state, 1)
  const terminal = terminalInstances[0]
  const fitAddon = fitAddonInstances[0]
  const resizeObserver = resizeObserverInstances[0]

  expect(terminal.opened).toBe(state.$Viewlet)
  expect(terminal.options).toMatchObject({
    cols: 80,
    convertEol: true,
    cursorBlink: true,
    rows: 24,
  })
  expect(terminal.addons).toEqual([fitAddon])
  expect(fitAddon.fitCalls).toBe(1)
  expect(resizeObserver.observed).toEqual([state.$Viewlet])
})

test('setTerminal only mounts once while xterm is loading', async () => {
  const state = ViewletTerminal2.create()
  await Promise.all([ViewletTerminal2.setTerminal(state, 1), ViewletTerminal2.setTerminal(state, 1)])
  expect(terminalInstances).toHaveLength(1)
})

test('forwards xterm input and resize events', async () => {
  const state = ViewletTerminal2.create()
  await ViewletTerminal2.setTerminal(state, 2)
  const terminal = terminalInstances[0]

  terminal.dataListener('abc')
  expect(handleInput).toHaveBeenCalledWith(2, 'abc')
  terminal.resizeListener({ cols: 120, rows: 40 })
  expect(resize).toHaveBeenCalledWith(2, { columns: 120, rows: 40 })
})

test('fits xterm when its container resizes', async () => {
  const state = ViewletTerminal2.create()
  await ViewletTerminal2.setTerminal(state, 3)
  const fitAddon = fitAddonInstances[0]
  const resizeObserver = resizeObserverInstances[0]

  resizeObserver.callback([], resizeObserver as unknown as ResizeObserver)
  expect(fitAddon.fitCalls).toBe(2)
})

test('buffers pty output until xterm is mounted', async () => {
  const state = ViewletTerminal2.create()
  const first = new Uint8Array([97, 98, 99])
  const second = new Uint8Array([100, 101, 102])
  ViewletTerminal2.write(state, first)
  ViewletTerminal2.write(state, second)

  await ViewletTerminal2.setTerminal(state, 4)
  expect(terminalInstances[0].written).toEqual([first, second])
  expect(state.pendingData).toEqual([])
})

test('writes pty output to a mounted xterm', async () => {
  const state = ViewletTerminal2.create()
  await ViewletTerminal2.setTerminal(state, 5)
  const data = new Uint8Array([97, 98, 99])
  ViewletTerminal2.write(state, data)
  expect(terminalInstances[0].written).toEqual([data])
})

test('attachEvents focuses terminal on mousedown', async () => {
  const state = ViewletTerminal2.create()
  await ViewletTerminal2.setTerminal(state, 6)
  ViewletTerminal2.attachEvents(state)

  state.$Viewlet.dispatchEvent(new MouseEvent('mousedown'))
  expect(terminalInstances[0].focused).toBe(true)
})

test('dispose releases xterm resources and listeners', async () => {
  const state = ViewletTerminal2.create()
  await ViewletTerminal2.setTerminal(state, 7)
  ViewletTerminal2.attachEvents(state)
  const terminal = terminalInstances[0]
  const resizeObserver = resizeObserverInstances[0]

  ViewletTerminal2.dispose(state)
  terminal.focused = false
  state.$Viewlet.dispatchEvent(new MouseEvent('mousedown'))

  expect(terminal.dataDisposable.disposed).toBe(true)
  expect(terminal.resizeDisposable.disposed).toBe(true)
  expect(terminal.disposed).toBe(true)
  expect(terminal.focused).toBe(false)
  expect(resizeObserver.disconnected).toBe(true)
  expect(state.terminal).toBeUndefined()
})

test('dispose while loading prevents xterm from mounting', async () => {
  const state = ViewletTerminal2.create()
  const mountPromise = ViewletTerminal2.setTerminal(state, 8)
  ViewletTerminal2.dispose(state)
  await mountPromise

  expect(terminalInstances[0].disposed).toBe(true)
  expect(state.terminal).toBeUndefined()
})
