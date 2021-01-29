kantan_app = attach_kantan({
    element_id: 'app',
    data: {
        box: [
            0,
            1,
            2,
        ],
        show_personal_info: false,
        show_books: false,
        show_haiku: false,
        show_essay: false,
        show_schedule: false,
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
    },
})
