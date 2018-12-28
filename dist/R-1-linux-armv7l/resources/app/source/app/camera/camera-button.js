class CameraButton {
    constructor(options) {
        this._button = options.button
        this._circle = options.circle
        this._button.addEventListener('click', options.action)

        this._icon = document.createElement('div')
        this._icon.classList.add('r-bar-button-icon')
        this._button.appendChild(this._icon)

        this._states = {}

        this.initAnimations()
    }

    initAnimations() {
        this._button.addEventListener('mousedown', () => {
            this._circle.classList.add('r-bar-button-circle-click')
        })

        this._button.addEventListener('mouseup', () => {
            // we remove, trigger reflow, & re-add to restart anim
            // in case the button is clicked again mid-anim
            this._circle.classList.remove('r-bar-button-circle-click')
            this._circle.classList.remove('r-bar-button-circle-release')
            this._circle.offsetWidth
            this._circle.classList.add('r-bar-button-circle-release')
        })
    }

    addState(state) {
        this._states[state.name] = state.icon
    }

    switchToState(name) {
        let icon = this._states[name]
        if (!icon) return
        this._icon.style.backgroundImage = `url(${icon})`
    }

    setVisible(visible) {
        this._button.style.visible = visible ? 'visible' : 'hidden'
    }
}

exports.CameraButton = CameraButton
