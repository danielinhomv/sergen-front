import { API_URL } from '@/environment/Api';
import { Bull } from '@/model/management/Bull';
import { HttpService } from '@/services/HttpService';
import { useSessionPropertyStore } from '@/store/SessionProperty';

const PREFIX = '/management/bull';

export class BullService extends HttpService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        super();
        this.baseUrl = baseUrl;
    }

    async listBulls() {
        try {
            const sessionStore = useSessionPropertyStore();
            const userId = sessionStore.getUser?.id;

            const response = await fetch(`${this.baseUrl}/all`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ user_id: userId }) 
            });

            const data = await this.handleResponse(response);
            const list = data.bovine || [];
            return list.map(item => Bull.fromJson(item));
        } catch (error) {
            console.error('BullService listBulls Error:', error);
            throw error;
        }
    }

    async createBull(bull) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(bull.toJson()),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('BullService createBull Error:', error);
            throw error;
        }
    }

    async updateBull(id, bull) {
        try {
            const response = await fetch(`${this.baseUrl}/update`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    id: id,
                    ...bull.toJson()
                }),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('BullService updateBull Error:', error);
            throw error;
        }
    }
}

export default BullService;