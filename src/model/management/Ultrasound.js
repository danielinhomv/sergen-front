// Ultrasound.ts
export class Ultrasound {
    constructor({
        id,
        vitaminsAndMinerals,
        status,
        protocolDetails,
        usedProductsSummary,
        workTeam,
        date,
        controlBovineId,
        refugo
    }) {
        this.id = id;
        this.vitaminsAndMinerals = vitaminsAndMinerals;
        this.status = status;
        this.protocolDetails = protocolDetails;
        this.usedProductsSummary = usedProductsSummary;
        this.workTeam = workTeam;
        this.date = date;
        this.controlBovineId = controlBovineId;
        this.refugo = refugo;
    }

    static fromJson(data) {
        return new Ultrasound({
            id: data.id,
            vitaminsAndMinerals: data.vitamins_and_minerals,
            status: data.status,
            protocolDetails: data.protocol_details,
            usedProductsSummary: data.used_products_summary,
            workTeam: data.work_team,
            date: data.date,
            controlBovineId: data.control_bovine_id,
            refugo: data.refugo
        });
    }

    toJson() {
        return {
            vitamins_and_minerals: this.vitaminsAndMinerals,
            status: this.status,
            protocol_details: this.protocolDetails,
            used_product_summary: this.usedProductsSummary,
            work_team: this.workTeam,
            date: this.date,
            control_bovine_id: this.controlBovineId,
            refugo: this.refugo
        };
    }
}

export default Ultrasound;
