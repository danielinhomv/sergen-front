export class Birth {
    constructor({
        id,
        birthdate,
        sex,
        birthWeight,
        rgd,
        typeOfBirth,
        controlBovineId
    }) {
        this.id = id;
        this.birthdate = birthdate;
        this.sex = sex;
        this.birthWeight = birthWeight;
        this.rgd = rgd;
        this.typeOfBirth = typeOfBirth;
        this.controlBovineId = controlBovineId;
    }

    static fromJson(data) {
        return new Birth({
            id: data.id,
            birthdate: data.birthdate,
            sex: data.sex,
            birthWeight: data.birth_weight,
            rgd: data.rgd,
            typeOfBirth: data.type_of_birth,
            controlBovineId: data.control_bovine_id
        });
    }

    toJson() {
        return {
            birthdate: this.birthdate,
            sex: this.sex,
            birth_weight: this.birthWeight,
            rgd: this.rgd,
            type_of_birth: this.typeOfBirth,
            control_bovine_id: this.controlBovineId
        };
    }
}

export default Birth;
