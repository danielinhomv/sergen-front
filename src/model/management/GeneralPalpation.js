// GeneralPalpation.ts
export class GeneralPalpation {
    constructor({
        id,
        status,
        observation,
        date,
        controlBovineId
    }) {
        this.id = id;
        this.status = status;
        this.observation = observation;
        this.date = date;
        this.controlBovineId = controlBovineId;
    }

    static fromJson(data) {
        return new GeneralPalpation({
            id: data.id,
            status: data.status,
            observation: data.observation,
            date: data.date,
        });
    }

    toJson() {
        return {
            status: this.status,
            observation: this.observation,
            date: this.date,
            control_bovine_id: this.controlBovineId
        };
    }
}

export default GeneralPalpation;
