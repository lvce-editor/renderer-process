import { ModuleWorkerWithMessagePortRpcParent, PlainMessagePortRpc, type Rpc } from '@lvce-editor/rpc'
import * as commandMapRef from '../CommandMapRef/CommandMapRef.ts'
import * as EditorOnlyConfig from '../EditorOnlyConfig/EditorOnlyConfig.ts'
import * as EditorOnlyKeyBinding from '../EditorOnlyKeyBinding/EditorOnlyKeyBinding.ts'
import * as EditorOnlyViewlet from '../EditorOnlyViewlet/EditorOnlyViewlet.ts'
import * as EditorWorkerUrl from '../EditorWorkerUrl/EditorWorkerUrl.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import * as SyntaxHighlightingWorkerUrl from '../SyntaxHighlightingWorkerUrl/SyntaxHighlightingWorkerUrl.ts'
import * as VirtualDom from '../VirtualDom/VirtualDom.ts'

const editorUid = 1

interface TypingBenchmarkApi {
  readonly focus: () => void
  readonly getText: () => string
}

declare global {
  interface Window {
    __typingBenchmark?: TypingBenchmarkApi
  }
}

const getCharWidth = (fontFamily: string, fontSize: number, fontWeight: number): number => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) {
    return 9
  }
  context.font = `${fontWeight} ${fontSize}px ${fontFamily}`
  return context.measureText('a').width
}

const launchWorker = async (name: string, url: string, commandMap: Record<string, (...args: any[]) => unknown>): Promise<Rpc> => {
  const { port1, port2 } = new MessageChannel()
  await ModuleWorkerWithMessagePortRpcParent.create({
    commandMap: {},
    name,
    port: port1,
    url,
  })
  return PlainMessagePortRpc.create({
    commandMap,
    messagePort: port2,
  })
}

const getBounds = () => {
  return {
    height: window.innerHeight,
    width: window.innerWidth,
    x: 0,
    y: 0,
  }
}

const getEditorMethod = (command: string): string => {
  return command.includes('.') ? command : `Editor.${command}`
}

const render = async (editorRpc: Rpc): Promise<void> => {
  const diffResult = await editorRpc.invoke('Editor.diff2', editorUid)
  const commands = await editorRpc.invoke('Editor.render2', editorUid, diffResult)
  EditorOnlyViewlet.executeCommands(commands)
}

const focus = (): void => {
  const input = document.querySelector<HTMLTextAreaElement>('.EditorInput textarea')
  input?.focus()
}

const markRendered = async (): Promise<void> => {
  await new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
  performance.mark('syntax-highlight-rendered')
  document.documentElement.dataset.renderBenchmarkReady = 'true'
}

const setError = (error: unknown): void => {
  document.documentElement.dataset.benchmarkReady = 'error'
  document.body.textContent = error instanceof Error ? error.stack || error.message : String(error)
}

export const main = async (): Promise<void> => {
  document.documentElement.dataset.benchmarkStage = 'starting'
  try {
    document.documentElement.dataset.benchmarkStage = 'launching-syntax-worker'
    const syntaxHighlightingRpc = await launchWorker('Syntax Highlighting Worker', SyntaxHighlightingWorkerUrl.syntaxHighlightingWorkerUrl, {})
    Object.assign(commandMapRef.commandMapRef, {
      'Main.handleModifiedStatusChange': () => undefined,
      'SendMessagePortToSyntaxHighlightingWorker.sendMessagePortToSyntaxHighlightingWorker': async (
        port: MessagePort,
        initialCommand: string,
      ): Promise<void> => {
        document.documentElement.dataset.benchmarkStage = 'connecting-syntax-worker'
        await syntaxHighlightingRpc.invokeAndTransfer(initialCommand, port)
        document.documentElement.dataset.benchmarkStage = 'syntax-worker-connected'
      },
    })

    document.documentElement.dataset.benchmarkStage = 'launching-editor-worker'
    const editorRpc = await launchWorker('Editor Worker', EditorWorkerUrl.editorWorkerUrl, commandMapRef.commandMapRef)
    document.documentElement.dataset.benchmarkStage = 'initializing-editor-worker'
    await editorRpc.invoke('Initialize.initialize', true, true)

    document.documentElement.dataset.benchmarkStage = 'creating-editor'
    const config = EditorOnlyConfig.getEditorOnlyConfig()
    const fontFamily = config.fontFamily || 'monospace'
    const fontSize = config.fontSize || 15
    const fontWeight = config.fontWeight || 400
    const bounds = getBounds()
    await editorRpc.invoke('Editor.createStandalone', {
      assetDir: '',
      charWidth: getCharWidth(fontFamily, fontSize, fontWeight),
      content: config.content || '',
      fontFamily,
      fontSize,
      fontWeight,
      ...bounds,
      id: editorUid,
      languageId: config.languageId || 'plaintext',
      letterSpacing: config.letterSpacing || 0,
      lineNumbers: config.lineNumbers || false,
      platform: PlatformType.Web,
      rowHeight: config.rowHeight || 20,
      tabSize: config.tabSize || 2,
      tokenizePath: config.tokenizePath || '',
      uri: config.uri || 'file:///standalone.txt',
    })

    document.documentElement.dataset.benchmarkStage = 'rendering-editor'
    EditorOnlyViewlet.create(editorUid)
    const listeners = await editorRpc.invoke('Editor.renderEventListeners')
    EditorOnlyViewlet.registerEventListeners(editorUid, listeners)

    let text = config.content || ''
    let pending = Promise.resolve()
    const executeQueued = async (previous: Promise<void>, command: string, args: readonly any[]): Promise<void> => {
      try {
        await previous
        await editorRpc.invoke(getEditorMethod(command), editorUid, ...args)
        await render(editorRpc)
        text = await editorRpc.invoke('Editor.getText', editorUid)
      } catch (error) {
        setError(error)
      }
    }
    const execute = (command: string, ...args: readonly any[]): void => {
      pending = executeQueued(pending, command, args)
    }
    VirtualDom.setIpc({
      send(method: string, uid: number, command: string, ...args: readonly any[]): void {
        if (method !== 'Viewlet.executeViewletCommand' || uid !== editorUid) {
          throw new Error(`Unsupported editor-only event: ${method}`)
        }
        execute(command, ...args)
      },
    })

    document.addEventListener(
      'keydown',
      (event) => {
        const command = EditorOnlyKeyBinding.getEditorCommand(event)
        if (!command) {
          return
        }
        event.preventDefault()
        execute(command)
      },
      { capture: true },
    )
    window.addEventListener('resize', () => {
      execute('resize', getBounds())
    })

    await render(editorRpc)
    Object.defineProperty(window, '__typingBenchmark', {
      configurable: true,
      value: {
        focus,
        getText: () => text,
      },
    })
    focus()
    await markRendered()
    document.documentElement.dataset.benchmarkReady = 'true'
    document.documentElement.dataset.benchmarkStage = 'ready'
  } catch (error) {
    setError(error)
  }
}
