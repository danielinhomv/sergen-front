// src/model/management/ControlBovine.js
export class ControlBovine {
    constructor({ id = null, bovine_id, control_id, property_id }) {
        this.id = id;
        this.bovine_id = bovine_id;
        this.control_id = control_id;
        this.property_id = property_id;
    }

    static fromJson(json) {
        return new ControlBovine({
            id: json.id,
            bovine_id: json.bovine_id,
            control_id: json.control_id
        });
    }

    toJson() {
        return {
            bovine_id: this.bovine_id,
            control_id: this.control_id,
            property_id: this.property_id
        };
    }
}