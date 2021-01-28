function attach_kantan(controller) {
    validate_controller(controller)

    const FALSE = 'false'
    const TRUE = 'true'

    // Types of attributes that can be eval'd
    const SHOW_SELECTOR = '[k-show]'
    const SHOW_ATTR = 'k-show'
    function _eval_show() {
        let elements = document.querySelectorAll(SHOW_SELECTOR)
        for (const element of elements) {
            let value = element.getAttribute(SHOW_ATTR)
            if (![TRUE, FALSE].includes(value)) {
                value = controller.data[value]
            } else {
                value = value === TRUE ? true : false
            }

            if (!value) {
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
            let value = element.getAttribute(CLICK_ATTR)
            let method = controller.methods[value]
            if (!method) {
                throw new Error(`${value} is not defined in controller.methods!`)
            }

            if (!element.$has_click) {
                element.addEventListener(
                    'click',
                    () => {
                        controller.methods[value]()
                        controller.methods.$refresh()
                    }
                )
                element.$has_click = true
            }
        }
    }

    const FOR_SELECTOR = '[k-for]'
    const FOR_ATTR = 'k-for'
    function _eval_for() {
        let elements = document.querySelectorAll(FOR_SELECTOR)
        for (const element of elements) {
            // The child node is the one that we want to repeat
            if (!element.$child) {
                element.$child = element.firstElementChild
                if (!element.$child) {
                    throw new Error('v-for missing child node')
                }
            }

            let value = element.getAttribute(FOR_ATTR)
            let parts = value.split(' in ')
            let list_name = parts.pop()
            let item_name = parts.pop()
            let items = controller.data[list_name]
            console.log(items)
            if (!items) {
                throw new Error(`${list_name} is not defined in controller.data!`)
            }

            if (typeof items !== 'object') {
                throw new Error(`${list_name} is not an object`)
            }

            if (items.length === undefined) {
                items = Object.values(items)
            }

            // Really hacky and inefficient, but gets the job done
            // Clear inner nodes
            element.innerHTML = null

            // Loop through items and recreate nodes from $has_child
            for (const item of items) {
                let new_child = element.$child.cloneNode()
                new_child.$scope = controller.data
                new_child.$scope[item_name] = item
                element.appendChild(new_child)
            }
        }
    }

    // A bit dirty.. but it works.
    controller.methods = {
        // Copy original methods
        ...controller.methods,

        // Make sure methods have access to data
        data: controller.data,

        // Internal methods that we want to expose
        $refresh() {
            _eval_show()
            _eval_click()
            _eval_for()
        },
    }

    window.addEventListener('load', function() {
        controller.methods.$refresh()
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
