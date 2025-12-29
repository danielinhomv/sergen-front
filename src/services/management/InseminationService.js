import { Insemination } from '@/model/management/Insemination';
import { API_URL } from '@/environment/Api';
import { HttpService } from './HttpService';

const PREFIX = '/management/insemination';

export class InseminationService extends HttpService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        super();
        this.baseUrl = baseUrl;
    }

    async listInseminations(controlBovineId) {
        try {
            const response = await fetch(`${this.baseUrl}/all`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    "control_bovine_id": controlBovineId,
                }),
            });
            const data = await this.handleResponse(response);
            const list = data.insemination || data.inseminations || [];
            return list.map(item => Insemination.fromJson(item));
        } catch (error) {
            console.error('InseminationService List Error:', error);
            throw error;
        }
    }

    async createInsemination(insemination) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(insemination.toJson()),
            });
            const data = await this.handleResponse(response);
            const list = data.insemination || data.inseminations || [];
            return list.map(item => Insemination.fromJson(item));
        } catch (error) {
            console.error('InseminationService Create Error:', error);
            throw error;
        }
    }

    async editInsemination(id, insemination) {
        try {
            const response = await fetch(`${this.baseUrl}/update`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    id: id,
                    ...insemination.toJson()
                }),
            });
            const data = await this.handleResponse(response);
            const list = data.insemination || data.inseminations || [];
            return list.map(item => Insemination.fromJson(item));
        } catch (error) {
            console.error('InseminationService Update Error:', error);
            throw error;
        }
    }

    async deleteInsemination(id) {
        try {
            const response = await fetch(`${this.baseUrl}/delete`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ "id": id }),
            });
            const data = await this.handleResponse(response);
            const list = data.insemination || data.inseminations || [];
            return list.map(item => Insemination.fromJson(item));
        } catch (error) {
            console.error('InseminationService Delete Error:', error);
            throw error;
        }
    }
}

export default InseminationService;