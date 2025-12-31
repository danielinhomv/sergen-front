import { API_URL } from '@/environment/Api';
import { ControlBovine } from '@/model/management/ControlBovine';
import { HttpService } from '@/services/HttpService';

const PREFIX = '/management/control-bovine';

export class ControlBovineService extends HttpService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        super();
        this.baseUrl = baseUrl;
    }

    async createControlBovine(controlBovine) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(controlBovine.toJson()),
            });

            const data = await this.handleResponse(response);

            if (data.error) {
                throw new Error(data.error);
            }

            return ControlBovine.fromJson(data);
        } catch (error) {
            console.error('ControlBovineService Create Error:', error);
            throw error;
        }
    }
}

export default ControlBovineService;