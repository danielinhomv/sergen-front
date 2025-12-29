import { API_URL } from '@/environment/Api';
import { Presynchronization } from '@/model/management/Presynchronization';
import { HttpService } from './HttpService';

const PREFIX = '/management/pre-sincronizacion';

export class PresynchronizationService extends HttpService {
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

            return Presynchronization.fromJson(data);
        } catch (error) {
            console.error('PresynchronizationService GET Error:', error);
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
            console.error('PresynchronizationService CREATE Error:', error);
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
            console.error('PresynchronizationService UPDATE Error:', error);
            throw error;
        }
    }
}

export default PresynchronizationService;