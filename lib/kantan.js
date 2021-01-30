function attach_kantan(controller) {
    validate_controller(controller)


    // Types of attributes that can be eval'd
    const SHOW_SELECTOR = '[k-show]'
    const SHOW_ATTR = 'k-show'
    function _eval_show({context, element, value}) {
        value = _eval_value({context, value})
        if (!value) {
            element.style.display = 'none'
            return
        }
        element.style.display = ''
    }

    const TEXT_SELECTOR = '[k-text]'
    const TEXT_ATTR = 'k-text'
    function _eval_text({context, element, value}) {
        value = _eval_value({context, value})
        element.innerText = value
    }

    const CLICK_SELECTOR = '[k-click]'
    const CLICK_ATTR = 'k-click'
    function _eval_click({context, element, value}) {
        let controller = context.$controller
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

    /**
     * k-for='item in items' finds the 'items' in controller.data, then loops
     * through each item and creates a corresponding child element based on the
     * original child element. Then it creates a new, private, scope for the
     * new child element that includes the 'item' from 'items'.
     */
    const FOR_SELECTOR = '[k-for]'
    const FOR_ATTR = 'k-for'
    function _eval_for({context, element, value}) {
        // The child node is the one that we want to repeat
        if (!element.$child) {
            element.$child = element.firstElementChild
            if (!element.$child) {
                throw new Error('k-for missing child node')
            }
        }

        // Get the values of list_name
        let [item_name, list_name] = value.split(' in ')
        let items = _eval_value({context, value: list_name})

        // Validate items
        if (!items) {
            throw new Error(`${list_name} is not defined in controller.data!`)
        }

        if (typeof items !== 'object') {
            throw new Error(`${list_name} is not an object`)
        }

        // If the object is an array, just get the values
        if (items.length === undefined) {
            items = Object.values(items)
        }

        // TODO: Loop over the existing items and determine whether the item
        // still exists in the items array. If it does, leave it alone. If not,
        // then remove it.

        // Really hacky and inefficient, but gets the job done
        // Clear inner nodes
        element.innerHTML = null

        // Loop through items and recreate nodes from $has_child
        for (const item of items) {
            let new_child = element.$child.cloneNode(true)
            new_child = _attach_scope({element: new_child, context})

            // Add the item from the for loop to the scope
            new_child.$scope.data[item_name] = item

            // Add new element to the DOM
            element.appendChild(new_child)

            // Recursive evaluation of child elements
            new_child.$controller.$refresh()
        }
    }

    /*
     * This creates a new "private" scope for the element
     * where it inherits the attributes of the parent scope.
     */
    function _attach_scope({element, context}) {
        element.$controller = {
            ...context.$controller,
            $refresh() {
                _refresh(element)
            },
        }
        let context_scope = context.$scope ? context.$scope : {}
        element.$scope = {
            data: {
                ...context_scope,
            },
        }
        return element
    }

    const FALSE = 'false'
    const TRUE = 'true'
    /*
     * Not a true parser and interpreter.. but it does the job so far.
     */
    function _eval_value({ context, value }) {
        if ([TRUE, FALSE].includes(value)) {
            return value === TRUE
        }

        if (!context) {
            throw new Error('No context was provided!')
        }

        // Check local scope first
        if (context.$scope) {
            let data = context.$scope.data
            if (Object.keys(data).includes(value)) {
                return data[value]
            }
        }

        if (!context.$controller) {
            throw new Error('Context has no controller!')
        }
        return context.$controller.data[value]
    }

    function _in_scope({context, element}) {
        while (element.parentNode) {
            if (element.$controller) {
                if (element == context) {
                    return true
                }

                if (element != context) {
                    return false
                }
            }
            element = element.parentNode
        }
        return false
    }

    function _run_eval({
        context,
        selector,
        attr,
        eval_func,
    }) {
        // Check attributes on self first
        if (context.getAttribute(attr)) {
            let value = context.getAttribute(attr)
            eval_func({context, element: context, value})
        }

        let elements = context.querySelectorAll(selector)
        for (const element of elements) {
            if (!_in_scope({context, element})) {
                continue
            }

            let value = element.getAttribute(attr)
            eval_func({context, element, value})
        }
    }

    const eval_functions = [
        {
            selector: SHOW_SELECTOR,
            attr: SHOW_ATTR,
            eval_func: _eval_show,
        },

        {
            selector: FOR_SELECTOR,
            attr: FOR_ATTR,
            eval_func: _eval_for,
        },

        {
            selector: TEXT_SELECTOR,
            attr: TEXT_ATTR,
            eval_func: _eval_text,
        },

        {
            selector: CLICK_SELECTOR,
            attr: CLICK_ATTR,
            eval_func: _eval_click,
        },
    ]
    function _refresh(context) {
        for (const func of eval_functions) {
            _run_eval({
                ...func,
                context,
            })
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
            _refresh(controller.$element)
        },
    }

    window.addEventListener('load', function() {
        let element = document.getElementById(controller.element_id)
        element.$controller = controller
        controller.$element = element
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
