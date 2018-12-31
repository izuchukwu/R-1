const remote = require('electron').remote
const main = remote.require('./main')
const remoteConsole = remote.getGlobal('console')

let streaming = false
let viewfinder, canvas, capture
let width = 640, height = 0

function init() {
    viewfinder = document.getElementById('viewfinder')
    canvas = document.getElementById('canvas')
    capture = document.getElementById('capture')

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then((stream) => {
        viewfinder.srcObject = stream
        viewfinder.play()
    })
    .catch((err) => {
        console.log(err)
    })

    viewfinder.addEventListener('canplay', (event) => {
        if (!streaming) {
            height = viewfinder.videoHeight / (viewfinder.videoWidth/width)

            viewfinder.setAttribute('width', width)
            viewfinder.setAttribute('height', height)
            canvas.setAttribute('width', width)
            canvas.setAttribute('height', height)
            streaming = true
        }
    })

    viewfinder.addEventListener('click', (event) => {
        take()
        event.preventDefault()
    })
}

function take() {
    let context = canvas.getContext('2d')

    if (!width && height) return
    canvas.width = width
    canvas.height = height
    context.drawImage(viewfinder, 0, 0, width, height)

    let data = canvas.toDataURL('image/png')
    capture.setAttribute('src', data)

    viewfinder.style.visibility = 'hidden'
    canvas.style.visibility = 'hidden'
    capture.style.visibility = 'hidden'

    setTimeout(() => {
        viewfinder.style.visibility = 'hidden'
        canvas.style.visibility = 'hidden'
        capture.style.visibility = 'visible'

        setTimeout(() => {
            viewfinder.style.visibility = 'visible'
            canvas.style.visibility = 'visible'
            capture.style.visibility = 'hidden'
        }, 750)
    }, 250)
}

init()
