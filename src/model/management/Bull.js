// BirthToro.ts
export class Bull {

    constructor({ id, name, userId = null }) {
        this.id = id;
        this.name = name;
        this.userId = userId;
    }

    static fromJson(data) {
        return new Bull({
            id: data.id,
            name: data.name
        });
    }

    toJson() {
        return {
            name: this.name,
            user_id: this.userId
        };
    }
}

export default Bull;