function attach_kantan(controller) {
    validate_controller(controller)

    const FALSE = 'false'
    const TRUE = 'true'

    // Types of attributes that can be eval'd
    const SHOW_SELECTOR = '[k-show]'
    const SHOW_ATTR = 'k-show'
    function _eval_show({context, element, value}) {
        value = _eval_value({element, value})
        if (!value) {
            element.style.display = 'none'
            return
        }
        element.style.display = ''
    }

    const TEXT_SELECTOR = '[k-text]'
    const TEXT_ATTR = 'k-text'
    function _eval_text({context, element, value}) {
        value = _eval_value({element, value})
        element.innerText = value
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
    function _eval_for({context, element, value}) {
        // The child node is the one that we want to repeat
        if (!element.$child) {
            element.$child = element.firstElementChild
            if (!element.$child) {
                throw new Error('v-for missing child node')
            }
        }

        let [item_name, list_name] = value.split(' in ')
        let items = controller.data[list_name]
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
            new_child.$scope = {
                ...controller.data,
            }
            new_child.$scope[item_name] = item
            element.appendChild(new_child)
        }
    }

    // Not a true parser and interpreter.. but it does the job so far.
    function _eval_value({ element, value }) {
        if ([TRUE, FALSE].includes(value)) {
            return value === TRUE
        }

        if (!element) {
            return controller.data[value]
        }

        if (!element.$scope) {
            element.$scope = controller.data
        }
        return element.$scope[value]
    }

    function _run_eval({
        context,
        selector,
        attr,
        eval_func,
    }) {
        let elements = context.querySelectorAll(selector)
        for (const element of elements) {
            let value = element.getAttribute(attr)
            eval_func({context, element, value})
        }
    }

    function _refresh(context) {
        _run_eval({
            context,
            selector: SHOW_SELECTOR,
            attr: SHOW_ATTR,
            eval_func: _eval_show,
        })

        _run_eval({
            context,
            selector: FOR_SELECTOR,
            attr: FOR_ATTR,
            eval_func: _eval_for,
        })

        _run_eval({
            context,
            selector: TEXT_SELECTOR,
            attr: TEXT_ATTR,
            eval_func: _eval_text,
        })

        _eval_click()
    }

    // A bit dirty.. but it works.
    controller.methods = {
        // Copy original methods
        ...controller.methods,

        // Make sure methods have access to data
        data: controller.data,

        // Internal methods that we want to expose
        $refresh() {
            _refresh(controller.data.$element)
        },
    }

    window.addEventListener('load', function() {
        controller.data.$element = document.getElementById(controller.element_id)
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
        throw new Error("controller.data needs to be an object!")
    }
}
