import { getViewletInstance } from '@lvce-editor/virtual-dom'

export interface StartWebRpcAudioStreamOptions {
  readonly elementLocator: string
  readonly ephemeralKey: string
  readonly port: MessagePort
  readonly trackAudioData: boolean
  readonly uid: number
}

interface PcEntry {
  readonly connection: RTCPeerConnection
  readonly micAnalyzer: AnalyserNode | undefined
  readonly micStream: MediaStream
  readonly port: MessagePort
  readonly remoteAnalyzer: AnalyserNode | undefined
}

const pcs: Record<number, PcEntry> = Object.create(null)

const isAudioElement = (element: Element | null): element is HTMLAudioElement => {
  return element instanceof HTMLAudioElement
}

const queryAudio = (uid: number, elementLocator: string): HTMLAudioElement | undefined => {
  if (uid === -1) {
    const remoteAudio = document.querySelector(elementLocator)
    if (!isAudioElement(remoteAudio)) {
      console.error(`[webrtc] audio element not found`)
    }
    // @ts-ignore
    return remoteAudio
  }
  const $Viewlet = getViewletInstance(uid)
  const remoteAudio = $Viewlet.querySelector(elementLocator)
  if (!remoteAudio) {
    console.error('[webrtc] audio element not found')
    return
  }
  return remoteAudio
}

const setupLevelMeter = (audioCtx: AudioContext, stream: MediaStream, kind: string): AnalyserNode => {
  const source = audioCtx.createMediaStreamSource(stream)
  const analyser = audioCtx.createAnalyser()
  // TODO make variables confirguable
  analyser.fftSize = 512
  analyser.smoothingTimeConstant = 0.6
  source.connect(analyser)
  return analyser
}

export const startWebRtcAudioStream = async (options: StartWebRpcAudioStreamOptions) => {
  const { elementLocator, port, trackAudioData, uid } = options

  // 2. Set up the WebRTC peer connection.
  const pc = new RTCPeerConnection()

  const remoteAudio = queryAudio(uid, elementLocator)
  if (!remoteAudio) {
    console.error('[webrtc] audio element not found')
    return
  }
  let audioCtx: AudioContext | undefined
  let micAnalyzer: AnalyserNode | undefined
  let remoteAnalyzer: AnalyserNode | undefined
  if (trackAudioData) {
    // @ts-ignore
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }

  remoteAudio.autoplay = true
  pc.ontrack = (e) => {
    remoteAudio.srcObject = e.streams[0]

    if (trackAudioData && audioCtx) {
      remoteAnalyzer = setupLevelMeter(audioCtx, e.streams[0], '')
    }
  }

  const micStream = await navigator.mediaDevices.getUserMedia({ audio: true })

  if (trackAudioData && audioCtx) {
    micAnalyzer = setupLevelMeter(audioCtx, micStream, '')
  }

  pc.addTrack(micStream.getTracks()[0])

  const dc = pc.createDataChannel('oai-events')
  dc.addEventListener('message', (e) => {
    port.postMessage(e.data)
  })

  // 3. Standard WebRTC offer/answer handshake against the Realtime API.
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  pcs[uid] = { connection: pc, micAnalyzer, micStream, port, remoteAnalyzer }
  return offer.sdp
}

export interface SetRemoteDescriptionOptions {
  readonly sdp: string
  readonly type: 'answer'
  readonly uid: number
}

export const setRemoteDescription = async (options: SetRemoteDescriptionOptions) => {
  const { sdp, type, uid } = options
  const pc = pcs[uid]
  if (!pc) {
    throw new Error(`[webrtc] pc not found`)
  }
  const { connection } = pc
  await connection.setRemoteDescription({ sdp, type })
}

export const stopWebRtcAudioStream = async (options: SetRemoteDescriptionOptions) => {
  const { uid } = options
  const pc = pcs[uid]
  if (!pc) {
    return
  }
  // TODO use disposableMap maybe?
  const { connection, micStream, port } = pc
  delete pcs[uid]
  connection.close()
  for (const t of micStream.getTracks()) {
    t.stop()
  }
  port.close()
}

interface ReadMicLevelOptions {
  readonly uid: number
}

export interface MicLevelsResult {
  readonly micAnalyzerData: Uint8Array
  readonly remoteAnalyzerData: Uint8Array
}

export const readMicLevels = (options: ReadMicLevelOptions): MicLevelsResult => {
  const { uid } = options
  const pc = pcs[uid]
  if (!pc) {
    return {
      micAnalyzerData: new Uint8Array(),
      remoteAnalyzerData: new Uint8Array(),
    }
  }
  const { micAnalyzer, remoteAnalyzer } = pc
  let micAnalyzerData = new Uint8Array()
  if (micAnalyzer) {
    micAnalyzerData = new Uint8Array(micAnalyzer.frequencyBinCount)
    micAnalyzer.getByteTimeDomainData(micAnalyzerData)
  }
  let remoteAnalyzerData = new Uint8Array()
  if (remoteAnalyzer) {
    remoteAnalyzerData = new Uint8Array(remoteAnalyzer.frequencyBinCount)
    remoteAnalyzer.getByteTimeDomainData(remoteAnalyzerData)
  }
  return {
    micAnalyzerData,
    remoteAnalyzerData,
  }
}
