class RpgModel {
    #characters = {}
    #source = 'local'
    constructor(source) {
        this.#source = source
        if (source) {
            this.load_state()
        }
    }

    get_all() {
        return this.#characters
    }

    get_by_id(id) {
        return this.#characters[id]
    }

    save(character) {
        let id = character.id
        if (!id) {
            id = this.generate_short_id(5)
        }

        character.id = id
        this.#characters[id] = character
        this.save_state()
        return id
    }

    // Thank you to: https://stackoverflow.com/a/57355127/6055465
    generate_short_id(n) {
        var add = 1,
            max = 12 - add;

        if (n > max) {
            return this.generate_short_id(max) + this.generate_short_id(n - max);
        }

        max = Math.pow(10, n + add);
        var min = max / 10; // Math.pow(10, n) basically
        var number = Math.floor(Math.random() * (max - min + 1)) + min;

        return ("" + number).substring(add);
    }

    save_state() {
        const data = JSON.stringify(this.#characters)
        localStorage.setItem(this.#source, data)
    }

    load_state() {
        let data = localStorage.getItem(this.#source)
        if (!data) {
            return
        }
        data = JSON.parse(data)
        if (!data) {
            throw new Error('Saved data is invalid!')
        }
        this.#characters = data
    }
}
