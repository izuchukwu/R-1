let streaming = false
let viewfinder, canvas, flash, capture

function init() {
    viewfinder = document.getElementById('viewfinder')
    canvas = document.getElementById('canvas')
    flash = document.getElementById('flash')
    capture = document.getElementById('capture')

    navigator.mediaDevices.getUserMedia({video: true, audio: false})
        .then((stream) => {
            viewfinder.srcObject = stream
            viewfinder.play()
        }).catch((err) => {
            console.log(err)
        })

    viewfinder.addEventListener('canplay', (event) => {
        streaming = true
    })

    viewfinder.addEventListener('click', (event) => {
        take()
        event.preventDefault()
    })
}

function take() {
    let context = canvas.getContext('2d')
    context.drawImage(viewfinder, 0, 0, viewfinder.clientWidth, viewfinder.clientHeight)
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.clientWidth, canvas.clientHeight);


    let data = canvas.toDataURL('image/png');
    capture.setAttribute('src', data);
}

exports.source = WebRTCSource
