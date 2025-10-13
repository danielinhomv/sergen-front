export class Bovine {

    /**
     * Constructor de la clase Bovine.
     * @param {Object} data 
     * @param {number} data.id
     * @param {number | null} data.motherId
     * @param {string} data.serie
     * @param {string} data.rgd
     * @param {'male' | 'female'} data.sex
     * @param {number} data.weight
     * @param {string} data.birthdate
     * @param {number} data.propertyId
     */
    constructor({
        id,
        motherId,
        serie,
        rgd,
        sex,
        weight,
        birthdate,
        propertyId
    }) {
        this.id = id;
        this.motherId = motherId;
        this.serie = serie;
        this.rgd = rgd;
        this.sex = sex;
        this.weight = weight;
        this.birthdate = birthdate;
        this.propertyId = propertyId;
    }

    /**
     * Crea una instancia de Bovine a partir de un objeto JSON.
     * @param {Object} data 
     * @returns {Bovine}
     */
    static fromJson(data) {
        return new Bovine({
            id: data.id,
            motherId: data.mother_rgd,
            serie: data.serie,
            rgd: data.rgd,
            sex: data.sex,
            weight: data.weight,
            birthdate: data.birthdate,
            propertyId: data.property_id
        });
    }

    /**
     * Convierte la instancia actual de Bovine a formato JSON (para enviar al backend).
     * @returns {Object}
     */
    toJson() {
        return {
            mother_id: this.motherId,
            serie: this.serie,
            rgd: this.rgd,
            sex: this.sex,
            weight: this.weight,
            birthdate: this.birthdate,
            property_id: this.propertyId
        };
    }
}

export default Bovine;
