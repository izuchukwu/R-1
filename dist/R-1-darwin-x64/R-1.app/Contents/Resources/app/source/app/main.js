const electron = require('electron')
const {app, BrowserWindow, BrowserView} = require('electron')

/* App */

let camera
const cameraNavigationWidth = 100

function start() {
    let windowed = includesArgs(process.argv, '-w', '--windowed')
    if (windowed) console.log('Running R-1 windowed')

    let windowSize = windowed ? {
        width: 800,
        height: 480
    } : electron.screen.getPrimaryDisplay().workAreaSize

    let win = new BrowserWindow({
        width: windowSize.width,
        height: windowSize.height,
        titleBarStyle: 'hidden',
        backgroundColor: '#000',
        title: 'R-1',
        webPreferences: {
            nodeIntegration: true
        }
    })

    // Menu bar is hidden by default. Hold Alt to show
    win.setAutoHideMenuBar(true)
    win.setMenuBarVisibility(false)

    win.loadFile('source/app/start/start.html')
    win.on('closed', () => {win = null})

    setTimeout(() => {
        win.loadFile('source/app/camera/camera.html')
        camera = new BrowserView({
            webPreferences: {
                nodeIntegration: true
            }
        })
        win.setBrowserView(camera)
        camera.setBounds({
            x:cameraNavigationWidth,
            y: 0,
            width: windowSize.width - cameraNavigationWidth,
            height: windowSize.height})
        camera.webContents.loadFile('source/app/camera/camera-default.html')
        camera.setAutoResize({
            width: true,
            height: true
        })
    }, 3000)
}

/* Camera UI */

exports.loadFileInCamera = (file) => {
    camera.loadFile(file)
}

/* App Events */

app.on('ready', start)
app.on('window-all-closed', () => {app.quit()})

/* Utils */

function includesArgs(args, short, long) {
    if (!args) return false
    return [short, long].some((arg) => arg ? args.includes(arg) : false)
}
