const electron = require('electron')
const {app, BrowserWindow, BrowserView} = require('electron')

/* App */

let win, content
const rbarWidth = 100

function start() {
    let windowed = includesArgs(process.argv, '-w', '--windowed')
    if (windowed) console.log('Running R-1 windowed')

    let windowSize = windowed ? {
        width: 800,
        height: 480
    } : electron.screen.getPrimaryDisplay().workAreaSize

    win = new BrowserWindow({
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
        win.loadFile('source/app/rbar/rbar.html')

        content = new BrowserView({
            webPreferences: {
                nodeIntegration: true
            }
        })
        win.setBrowserView(content)

        content.setBounds({
            x: rbarWidth,
            y: 0,
            width: windowSize.width - rbarWidth,
            height: windowSize.height})
        content.setAutoResize({
            width: true,
            height: true
        })
        content.webContents.loadFile('source/app/sources/source-null.html')
    }, 3000)
}

/* R-Bar I/O */

let brightnessOption, navigationOption

exports.initNavigationAndBrightnessState = () => {
    setBrightnessOption('mid')
    setNavigationOption('settings')
}

exports.brightnessTapped = () => {
    switch (brightnessOption) {
        case 'high':
            setBrightnessOption('low')
            break
        case 'low':
            setBrightnessOption('mid')
            break
        default:
        case 'mid':
            setBrightnessOption('high')
            break
    }
}

function setBrightnessOption(option) {
    brightnessOption = option
    win.webContents.executeJavaScript(`setBrightnessOption('${brightnessOption}')`)
}

exports.navigationTapped = () => {}

function setNavigationOption(option) {
    navigationOption = option
    win.webContents.executeJavaScript(`setNavigationOption('${navigationOption}')`)
}

/* App Events */

app.on('ready', start)
app.on('window-all-closed', () => {app.quit()})

/* Utils */

function includesArgs(args, short, long) {
    if (!args) return false
    return [short, long].some((arg) => arg ? args.includes(arg) : false)
}
