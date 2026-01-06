export class Control {

    constructor({
        id,
        propertyId,
        startDate,
        endDate
    }) {
        this.id = id;
        this.propertyId = propertyId;
        this.startDate = startDate;
        this.endDate = endDate;
    }

    static fromJson(data) {
        return new Control({
            id: data.id,
            propertyId: data.property_id,
            startDate: data.start_date,
            endDate: data.end_date
        });
    }

    toJson() {
        return {
            id: this.id,
            property_id: this.propertyId,
            start_date: this.startDate,
            end_date: this.endDate
        };
    }
}

export default Control;