// ConfirmatoryUltrasound.ts
export class ConfirmatoryUltrasound {
    constructor({
        id,
        status,
        observation,
        refugo,
        date,
        controlBovineId
    }) {
        this.id = id;
        this.status = status;
        this.observation = observation;
        this.refugo = refugo;
        this.date = date;
        this.controlBovineId = controlBovineId;
    }

    static fromJson(data) {
        return new ConfirmatoryUltrasound({
            id: data.id,
            status: data.status,
            observation: data.observation,
            refugo: data.refugo,
            date: data.date,
            controlBovineId: data.control_bovine_id
        });
    }

    toJson() {
        return {
            status: this.status,
            observation: this.observation,
            refugo: this.refugo,
            date: this.date,
            control_bovine_id: this.controlBovineId
        };
    }
}

export default ConfirmatoryUltrasound;
