import { API_URL } from '@/environment/Api';
import { GeneralPalpation } from '@/model/management/GeneralPalpation';
import { HttpService } from '@/services/HttpService';

const PREFIX = '/management/general-palpation';

export class GeneralPalpationService extends HttpService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        super();
        this.baseUrl = baseUrl;
    }

    async get(controlBovineId) {
        try {
            const response = await fetch(`${this.baseUrl}/get`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    "control_bovine_id": controlBovineId,
                })
            });

            const data = await this.handleResponse(response);
            if (!data || data.error) return null;

            return GeneralPalpation.fromJson(data.GeneralPalpation);
        } catch (error) {
            console.error('GeneralPalpationService GET Error:', error);
            throw error;
        }
    }

    async create(item) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(item.toJson()),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('GeneralPalpationService CREATE Error:', error);
            throw error;
        }
    }

    async update(id, item) {
        try {
            const response = await fetch(`${this.baseUrl}/update`, {
                method: 'POST', 
                headers: this.getHeaders(),
                body: JSON.stringify({
                    id: id,
                    ...item.toJson()
                }),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('GeneralPalpationService UPDATE Error:', error);
            throw error;
        }
    }
}

export default GeneralPalpationService;