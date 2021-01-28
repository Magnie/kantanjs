kantan_app = attach_kantan({
    element_id: '#app',
    data: {
        test: true,
    },

    methods: {
        test_click() {
            this.data.test = !this.data.test
            this.$refresh()
        },
    },
})
