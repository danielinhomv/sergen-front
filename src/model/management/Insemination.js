
export class Insemination {

    /**
     * Constructor de la clase Insemination.
     * @param {Object} data 
     * @param {number} data.id 
     * @param {number} data.bodyConditionScore 
     * @param {number | null} data.controlBovineId
     * @param {string | null} data.heatQuality
     * @param {string | null} data.observation
     * @param {string | null} data.others 
     * @param {string} data.date 
     * @param {string} data.bull 
     */
    
    constructor(
        {
            id,
            controlBovineId,
            bodyConditionScore,
            heatQuality,
            observation,
            others,
            date,
            bull
        }
    ) {
        this.id = id;
        this.bodyConditionScore = bodyConditionScore;
        this.heatQuality = heatQuality;
        this.observation = observation;
        this.others = others;
        this.date = date;
        this.bull = bull;
        this.controlBovineId = controlBovineId;
    }

    static fromJson(data) {
        return new Insemination({
            id: data.id,
            bodyConditionScore: data.body_condition_score,
            heatQuality: data.heat_quality,
            observation: data.observation,
            others: data.others,
            date: data.date,
            bull: data.bull
        });
    }

    toJson() {
        return {
            body_condition_score: this.bodyConditionScore,
            heat_quality: this.heatQuality,
            observation: this.observation,
            others: this.others,
            date: this.date,
            bull_id: this.bull,
            control_bovine_id:this.controlBovineId
        };
    }
}

export default Insemination;