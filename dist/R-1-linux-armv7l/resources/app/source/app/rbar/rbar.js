const remote = require('electron').remote
const remoteConsole = require('electron').remote.getGlobal('console')
const {Button} = require('./rbar-button')
const {Clock} = require('./rbar-clock')

/* R-Bar */

function initRBar() {
    initClock()
    initNavigationAndBrightness()
}

/* Navigation & Brightness */

let navigationButton, navigationOption
let brightnessButton, brightnessOption

function initNavigationAndBrightness() {
    navigationButton = new Button({
        button: document.getElementById('button-navigation'),
        circle: document.getElementById('circle-button-navigation')
    })
    let navigationStates = ['settings', 'back']
    navigationStates.forEach(icon => {
        navigationButton.addState({
            name: icon,
            icon: `../../assets/rbar/rbar-navigation-${icon}.svg`
        })
    })
    setNavigationOption('settings')

    brightnessButton = new Button({
        button: document.getElementById('button-brightness'),
        circle: document.getElementById('circle-button-brightness'),
        action: advanceBrightness
    })
    let brightnessStates = ['low', 'mid', 'high']
    brightnessStates.forEach(icon => {
        brightnessButton.addState({
            name: icon,
            icon: `../../assets/rbar/rbar-brightness-${icon}.svg`
        })
    })
    setBrightnessOption('mid')
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

let clock

function initClock() {
    clock = new Clock({
        barContent: document.getElementById('bar-content')
    })
}

window.addEventListener('beforeunload', () => {
    clock.disposeObservers()
})

/* Init */

initRBar()
