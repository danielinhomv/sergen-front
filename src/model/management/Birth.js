export class Birth {
    constructor({
        id,
        birthdate,
        sex,
        birthWeight,
        rgd,
        typeOfBirth,
        bovineId, //id del bovino escaneado , es decir de la madre
        propertyId,
        controlBovineId,
        bullFather
    }) {
        this.id = id;
        this.birthdate = birthdate;
        this.sex = sex;
        this.birthWeight = birthWeight;
        this.rgd = rgd;
        this.typeOfBirth = typeOfBirth;
        this.bovineId = bovineId;
        this.propertyId = propertyId;
        this.controlBovineId = controlBovineId;
        this.bullFather = bullFather;
    }

    static fromJson(data) {
        return new Birth({
            id: data.id,
            birthdate: data.birthdate,
            sex: data.sex,
            birthWeight: data.birth_weight,
            rgd: data.rgd,
            typeOfBirth: data.type_of_birth,
            controlBovineId: data.control_bovine_id,
            bullFather: data.bull_father
        });
    }

    toJson() {
        return {
            birthdate: this.birthdate,
            sex: this.sex,
            birth_weight: this.birthWeight,
            rgd: this.rgd,
            type_of_birth: this.typeOfBirth,
            control_bovine_id: this.controlBovineId,
            bovine_id: this.bovineId,
            property_id: this.propertyId
        };
    }
}

export default Birth;
