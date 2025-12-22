// ImplantRemoval.ts
export class ImplantRemoval {
    constructor({
        id,
        status,
        workTeam,
        usedProductSummary,
        date,
        controlBovineId
    }) {
        this.id = id;
        this.status = status;
        this.workTeam = workTeam;
        this.usedProductSummary = usedProductSummary;
        this.date = date;
        this.controlBovineId = controlBovineId;
    }

    static fromJson(data) {
        return new ImplantRemoval({
            id: data.id,
            status: data.status,
            workTeam: data.work_team,
            usedProductSummary: data.used_product_summary,
            date: data.date,
            controlBovineId: data.control_bovine_id
        });
    }

    toJson() {
        return {
            status: this.status,
            work_team: this.workTeam,
            used_product_summary: this.usedProductSummary,
            date: this.date,
            control_bovine_id: this.controlBovineId
        };
    }
}

export default ImplantRemoval;
