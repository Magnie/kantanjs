kantan_app = attach_kantan({
    element_id: 'app',
    data: {
        model: null,
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
            'id',
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
        show_form: false,
        show_create: false,
        show_edit: false,
        edit_name: '',
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
            const nameInput = this.$element.querySelector('#name')
            nameInput.value = ''
            const idInput = this.$element.querySelector('#id')
            idInput.value = ''
            for (const input_name of this.data.stats) {
                const input = this.$element.querySelector(`#${input_name}`)
                input.value = this.methods.roll_3d6()
            }
        },

        save_character() {
            let character = {}
            for (const input_name of this.data.inputs) {
                const input = this.$element.querySelector(`#${input_name}`)
                character[input_name] = input.value
            }

            this.data.model.save(character)

            this.methods.get_characters()
            this.data.show_form = false
            this.data.show_create = false
            this.data.show_edit = false
        },

        get_characters() {
            if (!this.data.model) {
                throw new Error('No model was provided!')
            }
            const tmp_characters = this.data.model.get_all()
            let characters = []
            for (const i in tmp_characters) {
                characters.push(tmp_characters[i])
            }
            this.data.characters = characters
        },

        display_create_form() {
            this.methods.reset_stats()
            this.data.show_form = true
            this.data.show_create = true
            this.data.show_edit = false
        },

        display_edit_form(character_id) {
            const character = this.data.model.get_by_id(character_id)
            this.data.edit_name = character.name
            for (const input_name of this.data.inputs) {
                const input = this.$element.querySelector(`#${input_name}`)
                input.value = character[input_name]
            }

            this.data.show_form = true
            this.data.show_edit = true
            this.data.show_create = false
            this.$refresh()
        },

        display_delete_form(character_id) {
        },

        delete_character(character_id) {
        },
    },

    mounted() {
        this.data.model = new RpgModel('local')
        this.methods.get_characters()
    },
})
