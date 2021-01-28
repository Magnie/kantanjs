kantan_app = attach_kantan({
    element_id: '#app',
    data: {
        test: 1,
    },

    methods: {
        test_click() {
            console.log('clicked!')
        },
    },
})
