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
            'isRight',
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
        delete_character_id: null,
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

        clear_errors() {
            const errors = this.$element.querySelectorAll('div.danger')
            for (const error of errors) {
                error.classList.add('hide')
            }
        },

        is_form_valid() {
            let is_valid = true
            this.methods.clear_errors()

            // Validate name
            const nameInput = this.$element.querySelector('#name')
            if (nameInput.value.length === 0 || nameInput.value.length > 20) {
                // Name must be between 1 and 20 characters
                is_valid = false
                this.$element.querySelector('#labelName + .danger')
                    .classList.remove('hide')
            }

            // Validate stats
            for (const input_name of this.data.stats) {
                const input = this.$element.querySelector(`#${input_name}`)
                if (input.value <= 0 || input.value >= 19) {
                    // Error
                    const selector = `#label${input_name.capitalize()} + .danger`
                    this.$element.querySelector(selector)
                        .classList.remove('hide')
                    is_valid = false
                }
            }

            return is_valid
        },

        save_character() {
            if (! this.methods.is_form_valid()) {
                return
            }

            let character = {}
            for (const input_name of this.data.inputs) {
                let selector = `#${input_name}`

                // If gender, handle radio input
                if (input_name === 'gender') {
                    selector = `#${input_name}:checked`
                }
                const input = document.querySelector(selector)

                // If the hand input, handle checkbox
                if (input_name === 'isRight') {
                    input.checked
                    character['isRight'] = input.checked ? true : false
                    continue
                }

                // All other input fields
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
            this.methods.clear_errors()
            this.data.show_form = true
            this.data.show_create = true
            this.data.show_edit = false
            this.data.show_delete = false
        },

        display_edit_form(character_id) {
            this.methods.clear_errors()
            const character = this.data.model.get_by_id(character_id)
            this.data.edit_name = character.name
            for (const input_name of this.data.inputs) {
                if (input_name === 'gender') {
                    selector = `#${input_name}`
                    const inputs = this.$element.querySelectorAll(selector)
                    const value = character[input_name]
                    for (const input of inputs) {
                        input.checked = input.value == value ? true : false
                    }
                    continue
                }
                const input = this.$element.querySelector(`#${input_name}`)
                input.value = character[input_name]
            }

            this.data.show_form = true
            this.data.show_edit = true
            this.data.show_create = false
            this.data.show_delete = false
            this.$refresh()
        },

        display_delete_form(character_id) {
            this.data.delete_character_id = character_id
            this.data.edit_name = this.data.model.get_by_id(character_id).name
            this.data.show_form = false
            this.data.show_edit = false
            this.data.show_create = false
            this.data.show_delete = true
            this.$refresh()
        },

        delete_character() {
            this.data.model.delete(this.data.delete_character_id)
            this.methods.get_characters()
            this.methods.hide_form()
            this.$refresh()
        },

        hide_form() {
            this.data.show_form = false
            this.data.show_edit = false
            this.data.show_create = false
            this.data.show_delete = false
            this.$refresh()
        },
    },

    mounted() {
        this.data.model = new RpgModel('local')
        this.methods.get_characters()
    },
})

// Thank you: https://flaviocopes.com/how-to-uppercase-first-letter-javascript/
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1)
}
