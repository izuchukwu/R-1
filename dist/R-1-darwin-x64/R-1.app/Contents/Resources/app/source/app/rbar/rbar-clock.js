const moment = require('moment')
const settings = require('electron-settings')

class Clock {
    constructor(options) {
        this._observers = {}
        this.watchClockSettings()

        this._barContent = options.barContent

        this._container = document.createElement('div')
        this._container.classList.add('rbar-clock-container')
        this._barContent.appendChild(this._container)

        this._clock = document.createElement('div')
        this._clock.classList.add('rbar-clock')
        this._clock.classList.add('font-digits-tabular')
        this._container.appendChild(this._clock)

        this.bindAndTick(() => {
            let time = moment().format(this._is24Hour ? 'H:mm' : 'h:mm')
            this._clock.textContent = time
        })
    }

    bindAndTick(then) {
        // https://stackoverflow.com/a/23895414
        function tick() {
            let now = Date.now()
            then()
            setTimeout(tick, 1000 - (now % 1000))
        }
        tick()
    }

    watchClockSettings() {
        this._observers.is24Hour = settings.watch(Clock.is24HourSettingKey, this.updateClockSettings)
    }

    updateClockSettings() {
        if (!settings.has(Clock.is24HourSettingKey)) {
            settings.set(Clock.is24HourSettingKey, false)
        }

        this._is24Hour = settings.get(Clock.is24HourSettingKey)
    }

    disposeObservers() {
        Object.keys(this._observers).forEach(key => {
            this._observers[key].dispose()
            delete this._observers[key]
        })
    }
}

Clock.is24HourSettingKey = 'clock.is24Hour'

exports.Clock = Clock
