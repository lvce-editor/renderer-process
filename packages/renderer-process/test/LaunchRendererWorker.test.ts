import { beforeEach, expect, jest, test } from '@jest/globals'

const mockLaunchWorker = jest.fn<(...args: any[]) => Promise<any>>()

beforeEach(() => {
  jest.resetAllMocks()
  Object.defineProperty(globalThis, 'location', {
    configurable: true,
    value: { href: 'https://example.test/index.html' },
  })
})

jest.unstable_mockModule('../src/parts/LaunchWorker/LaunchWorker.ts', () => ({
  launchWorker: mockLaunchWorker,
}))

jest.unstable_mockModule('../src/parts/Platform/Platform.ts', () => ({
  platform: 2,
}))

jest.unstable_mockModule('../src/parts/PlatformType/PlatformType.ts', () => ({
  Electron: 2,
  Web: 1,
}))

jest.unstable_mockModule('../src/parts/RendererWorkerUrl/RendererWorkerUrl.ts', () => ({
  rendererWorkerUrl: '/rendererWorkerMain.js',
}))

const LaunchRendererWorker = await import('../src/parts/LaunchRendererWorker/LaunchRendererWorker.ts')

test('launches renderer worker without configuration in its URL', async () => {
  mockLaunchWorker.mockResolvedValue({ ok: true, value: undefined })

  await LaunchRendererWorker.launchRendererWorker()

  expect(mockLaunchWorker).toHaveBeenCalledWith({
    name: 'Renderer Worker (Electron)',
    url: 'https://example.test/rendererWorkerMain.js',
  })
})
