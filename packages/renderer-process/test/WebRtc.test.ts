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
