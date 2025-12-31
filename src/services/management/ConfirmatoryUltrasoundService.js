import { API_URL } from '@/environment/Api';
import { ConfirmatoryUltrasound } from '@/model/management/ConfirmatoryUltrasound';
import { HttpService } from '@/services/HttpService';

const PREFIX = '/management/confirmatory-ultrasound';

export class ConfirmatoryUltrasoundService extends HttpService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        super();
        this.baseUrl = baseUrl;
    }

    async list(controlBovineId) {
        try {
            const response = await fetch(`${this.baseUrl}/all`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    "control_bovine_id": controlBovineId
                })
            });

            const data = await this.handleResponse(response);
            const list = Array.isArray(data) ? data : (data.ultrasounds || []);
            return list.map(item => ConfirmatoryUltrasound.fromJson(item));
        } catch (error) {
            console.error('ConfirmatoryUltrasoundService list Error:', error);
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
            console.error('ConfirmatoryUltrasoundService create Error:', error);
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
            console.error('ConfirmatoryUltrasoundService update Error:', error);
            throw error;
        }
    }

    async delete(id) {
        try {
            const response = await fetch(`${this.baseUrl}/delete`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ id: id }),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('ConfirmatoryUltrasoundService delete Error:', error);
            throw error;
        }
    }
}

export default ConfirmatoryUltrasoundService;