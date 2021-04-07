kantan_app = attach_kantan({
    element_id: 'app',
    data: {
        box: [
            0,
            1,
            2,
        ],

        test: [
            [0, 1, 2],
            ['a', 'b', 'c', 'd'],
        ],
        show_personal_info: true,
        show_books: true,
        show_haiku: true,
        show_essay: true,
        show_schedule: true,
        show_portait: false,
    },

    methods: {
        append_thing() {
            this.data.box.push(this.data.box.length)
        },

        pop_thing() {
            this.data.box.pop()
        },

        toggle_personal_info() {
            this.data.show_personal_info = !this.data.show_personal_info
        },

        toggle_books() {
            this.data.show_books = !this.data.show_books
        },

        toggle_haiku() {
            this.data.show_haiku = !this.data.show_haiku
        },

        toggle_essay() {
            this.data.show_essay = !this.data.show_essay
        },

        toggle_schedule() {
            this.data.show_schedule = !this.data.show_schedule
        },

        show_modal() {
            this.data.show_portait = true
        },

        hide_modal() {
            this.data.show_portait = false
        },
    },
})
