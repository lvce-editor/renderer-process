import { getViewletInstance } from '@lvce-editor/virtual-dom'

export interface WebRtcAudioConstraints {
  readonly autoGainControl?: boolean
  readonly echoCancellation?: boolean
  readonly noiseSuppression?: boolean
}

export interface StartWebRpcAudioStreamOptions {
  readonly audioConstraints?: WebRtcAudioConstraints
  readonly audioDebugPort?: MessagePort
  readonly elementLocator: string
  readonly ephemeralKey: string
  readonly port: MessagePort
  readonly trackAudioData: boolean
  readonly uid: number
}

interface PcEntry {
  readonly audioCtx: AudioContext | undefined
  readonly audioDebugPort: MessagePort | undefined
  readonly connection: RTCPeerConnection
  readonly dataChannel: RTCDataChannel
  readonly inputAudioRecorder: MediaRecorder | undefined
  readonly micAnalyzer: AnalyserNode | undefined
  readonly micStream: MediaStream
  readonly port: MessagePort
  readonly remoteAnalyzer: {
    instance: AnalyserNode | undefined
  }
  readonly remoteAudio: HTMLAudioElement
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

const setupLevelMeter = (audioCtx: AudioContext, stream: MediaStream): AnalyserNode => {
  const source = audioCtx.createMediaStreamSource(stream)
  const analyser = audioCtx.createAnalyser()
  // TODO make variables confirguable
  analyser.fftSize = 512
  analyser.smoothingTimeConstant = 0.6
  source.connect(analyser)
  return analyser
}

const isSpeechStoppedEvent = (data: unknown): boolean => {
  if (typeof data !== 'string') {
    return false
  }
  try {
    const event = JSON.parse(data)
    return event?.type === 'input_audio_buffer.speech_stopped'
  } catch {
    return false
  }
}

const startInputAudioRecorder = (micStream: MediaStream, audioDebugPort: MessagePort | undefined): MediaRecorder | undefined => {
  if (!audioDebugPort) {
    return undefined
  }
  const recorder = new MediaRecorder(micStream)
  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) {
      audioDebugPort.postMessage(event.data)
    }
  }
  recorder.start()
  return recorder
}

export const startWebRtcAudioStream = async (options: StartWebRpcAudioStreamOptions) => {
  const { audioConstraints, audioDebugPort, elementLocator, port, trackAudioData, uid } = options

  // 2. Set up the WebRTC peer connection.
  const pc = new RTCPeerConnection()

  const remoteAudio = queryAudio(uid, elementLocator)
  if (!remoteAudio) {
    console.error('[webrtc] audio element not found')
    return
  }
  let audioCtx: AudioContext | undefined
  let micAnalyzer: AnalyserNode | undefined

  const remoteAnalyzerInstance: PcEntry['remoteAnalyzer'] = {
    instance: undefined,
  }
  if (trackAudioData) {
    // @ts-ignore
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }

  remoteAudio.autoplay = true
  pc.ontrack = (e) => {
    remoteAudio.srcObject = e.streams[0]

    if (trackAudioData && audioCtx) {
      remoteAnalyzerInstance.instance = setupLevelMeter(audioCtx, e.streams[0])
    }
  }

  const micStream = await navigator.mediaDevices.getUserMedia({ audio: audioConstraints ?? true })
  const inputAudioRecorder = startInputAudioRecorder(micStream, audioDebugPort)

  if (trackAudioData && audioCtx) {
    micAnalyzer = setupLevelMeter(audioCtx, micStream)
  }

  pc.addTrack(micStream.getTracks()[0])

  const dc = pc.createDataChannel('oai-events')
  dc.addEventListener('message', (e) => {
    port.postMessage(e.data)
    if (inputAudioRecorder?.state === 'recording' && isSpeechStoppedEvent(e.data)) {
      inputAudioRecorder.requestData()
    }
  })

  port.onmessage = (event) => {
    const { data } = event
    if (dc.readyState !== 'open') {
      return
    }
    dc.send(data)
  }

  // 3. Standard WebRTC offer/answer handshake against the Realtime API.
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  pcs[uid] = {
    audioCtx,
    audioDebugPort,
    connection: pc,
    dataChannel: dc,
    inputAudioRecorder,
    micAnalyzer,
    micStream,
    port,
    remoteAnalyzer: remoteAnalyzerInstance,
    remoteAudio,
  }
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

// TODO this has a race conditon when start/stop is pressed fast
export const stopWebRtcAudioStream = async (uid: number) => {
  const pc = pcs[uid]
  if (!pc) {
    return
  }
  // TODO use disposableMap maybe?
  const { audioCtx, audioDebugPort, connection, dataChannel, inputAudioRecorder, micStream, port, remoteAudio } = pc
  delete pcs[uid]
  connection.ontrack = null
  connection.close()
  dataChannel.close()
  if (inputAudioRecorder && inputAudioRecorder.state !== 'inactive') {
    inputAudioRecorder.ondataavailable = null
    inputAudioRecorder.stop()
  }
  for (const t of micStream.getTracks()) {
    t.stop()
  }
  port.close()
  audioDebugPort?.close()
  remoteAudio.srcObject = null
  if (audioCtx) {
    await audioCtx.close()
  }
}

export interface ReadMicLevelOptions {
  readonly uid: number
}

export interface MicLevelsResult {
  readonly micAnalyzerData: Uint8Array
  readonly remoteAnalyzerData: Uint8Array
}

const readMicLevel = (analyzer: AnalyserNode | undefined): Uint8Array => {
  let data = new Uint8Array()
  if (analyzer) {
    data = new Uint8Array(analyzer.frequencyBinCount)
    analyzer.getByteTimeDomainData(data)
  }
  return data
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
  const micAnalyzerData = readMicLevel(micAnalyzer)
  const remoteAnalyzerData = readMicLevel(remoteAnalyzer.instance)
  return {
    micAnalyzerData,
    remoteAnalyzerData,
  }
}
