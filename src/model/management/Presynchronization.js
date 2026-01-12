// Presynchronization.ts
export class Presynchronization {

    constructor({
        id,
        reproductiveVaccine,
        sincrogestProduct,
        antiparasiticProduct,
        vitaminsAndMinerals,
        applicationDate,
        controlBovineId
    }) {
        this.id = id;
        this.reproductiveVaccine = reproductiveVaccine;
        this.sincrogestProduct = sincrogestProduct;
        this.antiparasiticProduct = antiparasiticProduct;
        this.vitaminsAndMinerals = vitaminsAndMinerals;
        this.applicationDate = applicationDate;
        this.controlBovineId = controlBovineId;
    }

    static fromJson(data) {
        return new Presynchronization({
            id: data.id,
            reproductiveVaccine: data.reproductive_vaccine,
            sincrogestProduct: data.sincrogest_product,
            antiparasiticProduct: data.antiparasitic_product,
            vitaminsAndMinerals: data.vitamins_and_minerals,
            applicationDate: data.application_date
        });
    }

    toJson() {
        return {
            reproductive_vaccine: this.reproductiveVaccine,
            sincrogest_product: this.sincrogestProduct,
            antiparasitic_product: this.antiparasiticProduct,
            vitamins_and_minerals: this.vitaminsAndMinerals,
            application_date: this.applicationDate,
            control_bovine_id: this.controlBovineId
        };
    }
}

export default Presynchronization;
