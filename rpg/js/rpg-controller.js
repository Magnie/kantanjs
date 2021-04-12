kantan_app = attach_kantan({
    element_id: 'app',
    data: {
        characters: [
            {
                name: 'Sally Frost',
                race: 'Human',
                class: 'Knight',
                gender: 'Female',
            },
            {
                name: 'Devin Harper',
                race: 'Elf',
                class: 'Mage',
                gender: 'Male',
            },
        ],
        stats: [
            'strength',
            'dexterity',
            'constitution',
            'intelligence',
            'wisdom',
            'charisma',
        ],
        inputs: [
            'name',
            'gender',
            'hand',
            'race',
            'class',
            'strength',
            'dexterity',
            'constitution',
            'intelligence',
            'wisdom',
            'charisma',
        ],
        show_portait: false,
    },

    methods: {
        show_modal() {
            this.data.show_portait = true
        },

        hide_modal() {
            this.data.show_portait = false
        },

        get_random_integer(min, max) {
            return Math.floor(Math.random() * max) + min
        },

        roll_3d6() {
            return this.methods.get_random_integer(1, 6)
                + this.methods.get_random_integer(1, 6)
                + this.methods.get_random_integer(1, 6)
        },

        reset_stats() {
            for (const input_name of this.data.stats) {
                const input = this.$element.querySelector(`#${input_name}`)
                input.value = this.methods.roll_3d6()
            }
        },

        add_character() {
            let character = {}
            for (const input_name of this.data.inputs) {
                const input = this.$element.querySelector(`#${input_name}`)
                character[input_name] = input.value
            }
            this.data.characters.push(character)
            console.log(this.data.characters)
        },
    },

    mounted() {
        this.methods.reset_stats()
    },
})
