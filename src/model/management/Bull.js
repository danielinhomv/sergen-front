// BirthToro.ts
export class Bull {

    constructor({ id, name }) {
        this.id = id;
        this.name = name;
    }

    static fromJson(data) {
        return new Bull({
            id: data.id,
            name: data.name
        });
    }

    toJson() {
        return {
            name: this.name
        };
    }
}

export default Bull;