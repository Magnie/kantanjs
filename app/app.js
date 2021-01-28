kantan_app = attach_kantan({
    element_id: '#app',
    data: {
        test: true,
        show_personal_info: false,
    },

    methods: {
        toggle_personal_info() {
            this.data.show_personal_info = !this.data.show_personal_info
        },

        test_click() {
            this.data.test = !this.data.test
        },
    },
})
