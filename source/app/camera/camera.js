const moment = require('moment')
const remote = require('electron').remote
const remoteConsole = require('electron').remote.getGlobal('console')
const settings = require('electron').remote.require('electron-settings')
const {CameraButton} = require('./camera-button')
const {hasRPiSource} = require('../sources/rpi')
const {hasWebRTCSource} = require('../sources/webrtc')

/* Camera */

function initCamera() {
    // Load viewfinder
    if (hasRPiSource()) {
        remote.loadFileInCamera('../sources/rpi.html')
    } else if (hasWebRTCSource()) {
        remote.loadFileInCamera('../sources/webrtc.html')
    }
}

/* R-Bar */

function initRBar() {
    initStatusBar()
    initNavigationAndBrightness()
}

/* Status Bar */

let statusBar, statusBarItems

function initStatusBar() {
    statusBar = document.getElementById('status-bar')
    statusBarItems = {}
    initClock()
    setTimeout(initStatusBarItems, 2000)
}


/* Navigation & Brightness */

let navigationButton, navigationOption
let brightnessButton, brightnessOption

function initNavigationAndBrightness() {
    navigationButton = new CameraButton({
        button: document.getElementById('navigation-button'),
        circle: document.getElementById('navigation-button-circle')
    })
    let navigationStates = ['settings', 'back']
    navigationStates.forEach(icon => {
        navigationButton.addState({
            name: icon,
            icon: `../../assets/camera-navigation-${icon}.svg`
        })
    })
    navigationButton.switchToState('settings')

    brightnessButton = new CameraButton({
        button: document.getElementById('brightness-button'),
        circle: document.getElementById('brightness-button-circle'),
        action: advanceBrightness
    })
    let brightnessStates = ['low', 'mid', 'high']
    brightnessStates.forEach(icon => {
        brightnessButton.addState({
            name: icon,
            icon: `../../assets/camera-brightness-${icon}.svg`
        })
    })
    brightnessButton.switchToState('mid')
}

function setNavigationOption(option) {
    // option: settings, back
    navigationOption = option
    navigationButton.switchToState(option)
}

function setBrightnessVisible(visible) {
    brightnessButton.setVisible(visible)
}

function setBrightnessOption(option) {
    // option: high, mid, low
    brightnessOption = option
    brightnessButton.switchToState(option)
}

function advanceBrightness() {
    switch (brightnessOption) {
        case 'high':
            setBrightnessOption('low')
            break
        case 'mid':
            setBrightnessOption('high')
            break
        default:
        case 'low':
            setBrightnessOption('mid')
            break
    }
}

/* Clock */

let clockIs24Hour, clockIs24HourObserver
const clockIs24HourKeyPath = 'clock.is24Hour'

function initClock() {
    clockIs24HourObserver = settings.watch(clockIs24HourKeyPath, updateClockSettings)

    let clock = document.createElement('div')
    clock.classList.add('status-bar-item')
    clock.classList.add('status-bar-clock')
    statusBar.appendChild(clock)
    statusBarItems.clock = clock

    updateClockSettings()

    bindAndTick(() => {
        let time = moment().format(clockIs24Hour ? 'H:mm' : 'h:mm')
        statusBarItems.clock.textContent = time
    })
}

function updateClockSettings() {
    if (!settings.has(clockIs24HourKeyPath)) {
        settings.set(clockIs24HourKeyPath, false)
    }

    clockIs24Hour = settings.get(clockIs24HourKeyPath)
}

function bindAndTick(then) {
    // https://stackoverflow.com/a/23895414
    function tick() {
        let now = Date.now()
        then()
        setTimeout(tick, 1000 - (now % 1000))
    }
    tick()
}

window.addEventListener('beforeunload', () => {
    if (clockIs24HourObserver) clockIs24HourObserver.dispose()
})

/* Init */

initRBar()
