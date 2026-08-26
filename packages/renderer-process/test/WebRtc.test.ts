/**
 * @jest-environment jsdom
 */
import { expect, jest, test } from '@jest/globals'
import * as WebRtc from '../src/parts/WebRtc/WebRtc.ts'

test('forwards microphone constraints and cleans up the stream', async () => {
  const connectionClose = jest.fn()
  const dataChannelClose = jest.fn()
  const micTrackStop = jest.fn()
  const portClose = jest.fn()
  const dataChannel = {
    addEventListener: jest.fn(),
    close: dataChannelClose,
    readyState: 'open',
    send: jest.fn(),
  }
  const connection = {
    addTrack: jest.fn(),
    close: connectionClose,
    createDataChannel: jest.fn(() => dataChannel),
    createOffer: jest.fn(async () => ({ sdp: 'offer' })),
    ontrack: null as ((event: { readonly streams: readonly MediaStream[] }) => void) | null,
    setLocalDescription: jest.fn(async () => {}),
  }
  Object.defineProperty(globalThis, 'RTCPeerConnection', {
    configurable: true,
    value: jest.fn(() => connection),
  })
  const getUserMedia = jest.fn(async (_constraints: MediaStreamConstraints) => ({
    getTracks: () => [{ stop: micTrackStop }],
  }))
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: {
      getUserMedia,
    },
  })

  document.body.innerHTML = '<audio class="GptVoiceAudio"></audio>'
  const remoteAudio = document.querySelector<HTMLAudioElement>('.GptVoiceAudio')!
  const port = {
    close: portClose,
    onmessage: null,
    postMessage: jest.fn(),
  } as unknown as MessagePort
  await WebRtc.startWebRtcAudioStream({
    audioConstraints: {
      autoGainControl: false,
      echoCancellation: true,
      noiseSuppression: false,
    },
    elementLocator: '.GptVoiceAudio',
    ephemeralKey: 'test-key',
    port,
    trackAudioData: false,
    uid: -1,
  })
  expect(getUserMedia).toHaveBeenCalledWith({
    audio: {
      autoGainControl: false,
      echoCancellation: true,
      noiseSuppression: false,
    },
  })
  const remoteStream = {} as MediaStream
  connection.ontrack?.({ streams: [remoteStream] })
  expect(remoteAudio.srcObject).toBe(remoteStream)

  await WebRtc.stopWebRtcAudioStream(-1)

  expect(connectionClose).toHaveBeenCalledTimes(1)
  expect(dataChannelClose).toHaveBeenCalledTimes(1)
  expect(micTrackStop).toHaveBeenCalledTimes(1)
  expect(portClose).toHaveBeenCalledTimes(1)
  expect(remoteAudio.srcObject).toBeNull()
})

test('records each stopped speech turn as an independently playable debug recording', async () => {
  const requestData = jest.fn()
  const recorderStop = jest.fn()
  const recorders: MockMediaRecorder[] = []
  class MockMediaRecorder {
    readonly sequence: number
    requestCount = 0
    ondataavailable: ((event: { readonly data: Blob }) => void) | null
    onstop: (() => void) | null
    state: RecordingState = 'inactive'

    constructor() {
      recorders.push(this)
      this.sequence = recorders.length
      this.ondataavailable = null
      this.onstop = null
    }

    requestData(): void {
      requestData()
      this.requestCount++
      const contents = this.requestCount === 1 ? `webm-header-${this.sequence}` : `webm-continuation-${this.sequence}`
      this.ondataavailable?.({ data: new Blob([contents], { type: 'audio/webm' }) })
    }

    start(): void {
      this.state = 'recording'
    }

    stop(): void {
      this.state = 'inactive'
      recorderStop()
      this.ondataavailable?.({ data: new Blob([`webm-header-${this.sequence}`], { type: 'audio/webm' }) })
      this.onstop?.()
    }
  }
  Object.defineProperty(globalThis, 'MediaRecorder', {
    configurable: true,
    value: MockMediaRecorder,
  })
  const dataChannel = {
    addEventListener: jest.fn(),
    close: jest.fn(),
    readyState: 'open',
    send: jest.fn(),
  }
  const connection = {
    addTrack: jest.fn(),
    close: jest.fn(),
    createDataChannel: jest.fn(() => dataChannel),
    createOffer: jest.fn(async () => ({ sdp: 'offer' })),
    ontrack: null,
    setLocalDescription: jest.fn(async () => {}),
  }
  Object.defineProperty(globalThis, 'RTCPeerConnection', {
    configurable: true,
    value: jest.fn(() => connection),
  })
  const micStream = {
    getTracks: () => [{ stop: jest.fn() }],
  } as unknown as MediaStream
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: {
      getUserMedia: jest.fn(async () => micStream),
    },
  })
  document.body.innerHTML = '<audio class="GptVoiceAudio"></audio>'
  const port = {
    close: jest.fn(),
    onmessage: null,
    postMessage: jest.fn(),
  } as unknown as MessagePort
  const audioDebugPort = {
    close: jest.fn(),
    postMessage: jest.fn(),
  } as unknown as MessagePort

  await WebRtc.startWebRtcAudioStream({
    audioDebugPort,
    elementLocator: '.GptVoiceAudio',
    ephemeralKey: 'test-key',
    port,
    trackAudioData: false,
    uid: -1,
  })

  const messageListener = dataChannel.addEventListener.mock.calls[0]?.[1] as (event: { readonly data: string }) => void
  messageListener({ data: '{"type":"response.created"}' })
  messageListener({ data: '{"type":"input_audio_buffer.speech_stopped"}' })
  messageListener({ data: '{"type":"input_audio_buffer.speech_stopped"}' })

  expect(recorders).toHaveLength(3)
  expect(audioDebugPort.postMessage).toHaveBeenCalledTimes(2)

  await WebRtc.stopWebRtcAudioStream(-1)

  expect(requestData).not.toHaveBeenCalled()
  expect(recorderStop).toHaveBeenCalledTimes(3)
  expect(audioDebugPort.close).toHaveBeenCalledTimes(1)
})
