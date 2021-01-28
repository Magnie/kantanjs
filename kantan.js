function attach_kantan(controller) {
    validate_controller(controller)

    const FALSE = 'false'
    const TRUE = 'true'

    // nodes will be used to hold elements missing from the dom
    let nodes = {}

    const SHOW_SELECTOR = '[k-show]'
    const SHOW_ATTR = 'k-show'
    function _eval_show() {
        let elements = document.querySelectorAll(SHOW_SELECTOR)
        for (const element of elements) {
            let value = element.getAttribute(SHOW_ATTR)
            if (value == FALSE) {
                element.style.display = 'none'
                continue
            }
            element.style.display = ''
        }
    }

    const CLICK_SELECTOR = '[k-click]'
    const CLICK_ATTR = 'k-click'
    function _eval_click() {
        let elements = document.querySelectorAll(CLICK_SELECTOR)
        for (const element of elements) {
            element.$k_listeners = []
            let value = element.getAttribute(CLICK_ATTR)
            if (!controller.methods[value]) {
                throw new Error(`${value} is not defined in controller.methods!`)
            }
            element.$k_listeners.push(
                element.addEventListener('click', () => {
                    controller.methods[value]()
                })
            )
        }
    }

    controller.$refresh = function() {
        _eval_show()
        _eval_click()
    }

    window.addEventListener('load', function() {
        controller.$refresh()
    })

    return controller
}

function validate_controller(controller) {
    if (typeof controller !== 'object') {
        throw new Error("controller needs to be an object!")
    }

    if (typeof controller.methods !== 'object') {
        throw new Error("controller.methods needs to be an object!")
    }

    if (typeof controller.data !== 'object') {
        throw new Error("controller.methods needs to be an object!")
    }
}
