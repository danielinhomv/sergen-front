import { API_URL } from '@/environment/Api';
import { ImplantRemoval } from '@/model/management/ImplantRemoval';
import { HttpService } from '@/services/HttpService';

const PREFIX = '/management/implant-retrieval';

export class ImplantRemovalService extends HttpService {
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

            return ImplantRemoval.fromJson(data);
        } catch (error) {
            console.error('ImplantRemovalService GET Error:', error);
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
            console.error('ImplantRemovalService CREATE Error:', error);
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
            console.error('ImplantRemovalService UPDATE Error:', error);
            throw error;
        }
    }
}

export default ImplantRemovalService;