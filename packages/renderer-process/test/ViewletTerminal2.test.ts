/**
 * @jest-environment jsdom
 */
import { expect, jest, test } from '@jest/globals'

const terminalInstances: MockTerminal[] = []
const handleInput = jest.fn()
const resize = jest.fn()

class MockTerminal {
  public dataListener = (_data: string) => {}
  public resizeListener = (_event: { cols: number; rows: number }) => {}
  public disposed = false
  public focused = false
  public opened = false
  public written: any[] = []

  constructor(public options: any) {
    terminalInstances.push(this)
  }

  onData(listener) {
    this.dataListener = listener
    return {
      dispose() {},
    }
  }

  onResize(listener) {
    this.resizeListener = listener
    return {
      dispose() {},
    }
  }

  open() {
    this.opened = true
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
  expect(state.terminal).toBeUndefined()
})

test('setTerminal', () => {
  const state = ViewletTerminal2.create()
  ViewletTerminal2.setTerminal(state, 1)
  const terminal = terminalInstances.at(-1)!

  expect(terminal.opened).toBe(true)
  expect(terminal.options.convertEol).toBe(true)
  terminal.dataListener('abc')
  expect(handleInput).toHaveBeenCalledWith(1, 'abc')
  terminal.resizeListener({ cols: 120, rows: 40 })
  expect(resize).toHaveBeenCalledWith(1, { columns: 120, rows: 40 })
})

test('write', () => {
  const state = ViewletTerminal2.create()
  ViewletTerminal2.setTerminal(state, 2)
  const terminal = terminalInstances.at(-1)!
  const data = new Uint8Array([97, 98, 99])
  ViewletTerminal2.write(state, data)
  expect(terminal.written).toEqual([data])
})

test('dispose', () => {
  const state = ViewletTerminal2.create()
  ViewletTerminal2.setTerminal(state, 3)
  const terminal = terminalInstances.at(-1)!
  ViewletTerminal2.dispose(state)
  expect(terminal.disposed).toBe(true)
  expect(state.terminal).toBeUndefined()
})
