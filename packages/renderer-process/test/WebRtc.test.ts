/**
 * @jest-environment jsdom
 */
import { expect, jest, test } from '@jest/globals'
import * as WebRtc from '../src/parts/WebRtc/WebRtc.ts'

test('stopWebRtcAudioStream closes the connection and detaches remote audio', async () => {
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
  Object.defineProperty(navigator, 'mediaDevices', {
    configurable: true,
    value: {
      getUserMedia: jest.fn(async () => ({
        getTracks: () => [{ stop: micTrackStop }],
      })),
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
    elementLocator: '.GptVoiceAudio',
    ephemeralKey: 'test-key',
    port,
    trackAudioData: false,
    uid: -1,
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

test('records the microphone stream and emits one debug chunk when server VAD ends a message', async () => {
  const requestData = jest.fn()
  const recorderStop = jest.fn()
  const recorders: MockMediaRecorder[] = []
  class MockMediaRecorder {
    ondataavailable: ((event: { readonly data: Blob }) => void) | null
    state: RecordingState = 'inactive'

    constructor() {
      recorders.push(this)
      this.ondataavailable = null
    }

    requestData(): void {
      requestData()
    }

    start(): void {
      this.state = 'recording'
    }

    stop(): void {
      this.state = 'inactive'
      recorderStop()
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
  expect(requestData).toHaveBeenCalledTimes(1)

  const audio = new Blob(['recorded audio'], { type: 'audio/webm' })
  recorders[0]?.ondataavailable?.({ data: audio })
  expect(audioDebugPort.postMessage).toHaveBeenCalledWith(audio)

  await WebRtc.stopWebRtcAudioStream(-1)

  expect(recorderStop).toHaveBeenCalledTimes(1)
  expect(audioDebugPort.close).toHaveBeenCalledTimes(1)
})
