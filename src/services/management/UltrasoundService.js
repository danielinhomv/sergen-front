import { API_URL } from '@/environment/Api';
import { Ultrasound } from '@/model/management/Ultrasound';
import { HttpService } from '@/services/HttpService';

const PREFIX = '/management/ultrasound';

export class UltrasoundService extends HttpService {
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
                }),
            });

            const data = await this.handleResponse(response);
            if (!data || data.error) return null;

            return Ultrasound.fromJson(data);
        } catch (error) {
            console.error('UltrasoundService GET Error:', error);
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
            console.error('UltrasoundService CREATE Error:', error);
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
            console.error('UltrasoundService UPDATE Error:', error);
            throw error;
        }
    }
}

export default UltrasoundService;