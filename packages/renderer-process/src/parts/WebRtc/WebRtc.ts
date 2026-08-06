import { getViewletInstance } from '@lvce-editor/virtual-dom'

export interface StartWebRpcAudioStreamOptions {
  readonly elementLocator: string
  readonly ephemeralKey: string
  readonly uid: number
}

const pcs: Record<number, RTCPeerConnection> = Object.create(null)

export const startWebRtcAudioStream = async (options: StartWebRpcAudioStreamOptions) => {
  const { elementLocator, uid } = options

  // 2. Set up the WebRTC peer connection.
  const pc = new RTCPeerConnection()

  const $Viewlet = getViewletInstance(uid)
  const remoteAudio = $Viewlet.querySelector(elementLocator)
  if (!remoteAudio) {
    console.error('[webrtc] audio element not found')
    return
  }
  remoteAudio.autoplay = true
  pc.ontrack = (e) => {
    remoteAudio.srcObject = e.streams[0]
  }

  const micStream = await navigator.mediaDevices.getUserMedia({ audio: true })
  pc.addTrack(micStream.getTracks()[0])

  // const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  const dc = pc.createDataChannel('oai-events')
  dc.addEventListener(
    'message',
    (e) => {
      // TODO send to renderer worker
      // RenderWo
    },

    // handleServerEvent(JSON.parse(e.data))
  )

  // 3. Standard WebRTC offer/answer handshake against the Realtime API.
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)

  pcs[uid] = pc
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
  await pc.setRemoteDescription({ sdp, type })
}
