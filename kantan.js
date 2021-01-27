const TRUE = 'true'
const FALSE = 'false'

let store = {}
let nodes = []
function main() {
    refresh()
}

function refresh() {
    eval_show()
}

const SHOW_SELECTOR = '[k-show]'
const SHOW_ATTR = 'k-show'
function eval_show() {
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

window.addEventListener('load', function() {
    main()
})
