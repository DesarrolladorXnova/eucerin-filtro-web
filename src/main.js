import { bootstrapCameraKit, createMediaStreamSource, Transform2D } from '@snap/camera-kit'

const API_TOKEN      = 'eyJhbGciOiJIUzI1NiIsImtpZCI6IkNhbnZhc1MyU0hNQUNQcm9kIiwidHlwIjoiSldUIn0.eyJhdWQiOiJjYW52YXMtY2FudmFzYXBpIiwiaXNzIjoiY2FudmFzLXMyc3Rva2VuIiwibmJmIjoxNzgxODAwMzI2LCJzdWIiOiJiZDZlMmY4ZS1kMjMzLTQwYTQtOWQ3Ny0xNGUyM2RlZDdjNzl-U1RBR0lOR342ZjZlMDcyYi0wYmI3LTRjZDUtOGY1Ni1hYzk2ZjEzZWM2N2EifQ.ivwtS8IjW5TBnYK81fryF3hTOg9AN-W1jXcQ44JPOHA'
const LENS_ID        = '9ec109f7-8dfd-4427-bd7d-3db4cfa0a3c0'
const LENS_GROUP_ID  = '7da234fb-3103-4b7a-b0d9-605aa4a3141e'

const canvas = document.getElementById('canvas')

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
}

async function init() {
  console.log('1. Iniciando Camera Kit...')
  const cameraKit = await bootstrapCameraKit({ apiToken: API_TOKEN })

  console.log('2. Creando sesión...')
  const session = await cameraKit.createSession({ liveRenderTarget: canvas })

  console.log('3. Accediendo a cámara...')
  const mediaStream = await navigator.mediaDevices.getUserMedia({
    video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false,
  })

  console.log('4. Creando source...')
  const source = createMediaStreamSource(mediaStream, {
    cameraType: 'front',
    transform: Transform2D.MirrorX,
  })
  await session.setSource(source)

  const setSize = () => {
    const w = window.innerWidth
    const h = window.innerHeight
    console.log('Tamaño:', w, h)
    source.setRenderSize(w, h)
  }

  if (isIOS()) {
    setTimeout(setSize, 100)
  } else {
    setSize()
  }

  console.log('5. Cargando lens...')
  const lens = await cameraKit.lensRepository.loadLens(LENS_ID, LENS_GROUP_ID)

  console.log('6. Aplicando lens...')
  await session.applyLens(lens)

  console.log('7. Reproduciendo...')
  await session.play()

  console.log('8. Listo!')

  window.addEventListener('resize', () => {
    if (isIOS()) {
      setTimeout(setSize, 100)
    } else {
      setSize()
    }
  })

  document.getElementById('btn-capture').addEventListener('click', () => {
    const link = document.createElement('a')
    link.download = 'eucerin-foto.png'
    link.href = canvas.toDataURL('image/png')
    link.click()
  })
}

init().catch(console.error)