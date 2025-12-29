import { API_URL } from '@/environment/Api';
import { Birth } from '@/model/management/Birth';
import { HttpService } from './HttpService';

const PREFIX = '/management/birth';

export class BirthService extends HttpService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        super();
        this.baseUrl = baseUrl;
    }

    async createBirth(birth) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(birth.toJson()),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('BirthService Create Error:', error);
            throw error;
        }
    }

    async updateBirth(id, birth) {
        try {
            const response = await fetch(`${this.baseUrl}/update`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    id: id,
                    ...birth.toJson()
                }),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('BirthService Update Error:', error);
            throw error;
        }
    }

    async get(controlBovineId) {
        try {
            const response = await fetch(`${this.baseUrl}/get`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    "control_bovine_id": controlBovineId
                })
            });

            const data = await this.handleResponse(response);
            
            if (!data || Object.keys(data).length === 0) return null;

            return Birth.fromJson(data);
        } catch (error) {
            console.error('BirthService Get Error:', error);
            throw error;
        }
    }
}

export default BirthService;