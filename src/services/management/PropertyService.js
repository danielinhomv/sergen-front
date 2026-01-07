import Property from '@/model/management/Property';
import { API_URL } from '@/environment/Api';
import { HttpService } from '@/services/HttpService';
import { useSessionPropertyStore } from '@/store/SessionProperty';

const PREFIX = '/management/property';

export class PropertyService extends HttpService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        super();
        this.baseUrl = baseUrl;
    }

    async list() {
        try {
            const sessionStore = useSessionPropertyStore();
            const response = await fetch(`${this.baseUrl}/list`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ user_id: sessionStore.getUser?.id })
            });
            const data = await this.handleResponse(response);
            return (data.properties || []).map(p => new Property(p));
        } catch (error) {
            console.error('PropertyService list Error:', error);
            throw error;
        }
    }

    async create(property) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(property)
            });
            const data = await this.handleResponse(response);
            return new Property(data.property || data);
        } catch (error) {
            console.error('PropertyService create Error:', error);
            throw error;
        }
    }

async update(id, property) {
    try {
        const response = await fetch(`${this.baseUrl}/update/${id}`, {
            method: 'PUT', 
            headers: this.getHeaders(),
            body: JSON.stringify(property)
        });

        const data = await this.handleResponse(response);
        return new Property(data.property || data);
    } catch (error) {
        console.error('PropertyService update Error:', error);
        throw error;
    }
}

    async delete(id) {
        try {
            const response = await fetch(`${this.baseUrl}/delete`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ id })
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('PropertyService delete Error:', error);
            throw error;
        }
    }

    async getById(id) {
        try {
            const response = await fetch(`${this.baseUrl}/get`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ id })
            });
            const data = await this.handleResponse(response);
            return new Property(data.property || data);
        } catch (error) {
            console.error('PropertyService getById Error:', error);
            throw error;
        }
    }
}

export default PropertyService;