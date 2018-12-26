const moment = require('moment')
const settings = require('electron').remote.require('electron-settings')

let statusBar, statusBarItems

let clockIs24Hour, clockIs24HourObserver
let clockIs24HourKeyPath = 'clock.is24Hour'
let clockIsVisibleObserver
let clockIsVisibleKeyPath = 'clock.isVisible'

/* Status Bar */

function startStatusBar() {
    statusBar = document.getElementById('status-bar')
    statusBarItems = {}
    startClock()
}

startStatusBar()

/* Clock */

function startClock() {
    clockIs24HourObserver = settings.watch(clockIs24HourKeyPath, updateClockSettings)
    clockIsVisibleObserver = settings.watch(clockIsVisibleKeyPath, updateClockSettings)
    // Todo: Right now, this observer is never disposed
    // To be fair, they're an app-life-long observer, but I digress

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
    if (!settings.has(clockIsVisibleKeyPath)) {
        settings.set(clockIsVisibleKeyPath, true)
    }

    clockIs24Hour = settings.get(clockIs24HourKeyPath)
    clockIsVisible = settings.get(clockIsVisibleKeyPath)

    statusBarItems.clock.style.display = clockIsVisible ? 'block' : 'none'
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
