import { API_URL } from '@/environment/Api';
import { HttpService } from '@/services/HttpService';
import { Control } from '@/model/management/Control';

const PREFIX = '/management/protocol';

export class ControlService extends HttpService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        super();
        this.baseUrl = baseUrl;
    }

    async getByProperty(propertyId) {
        try {
            const response = await fetch(`${this.baseUrl}/get-last`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ property_id: propertyId }),
            });

            const data = await this.handleResponse(response);
            return (data.controls || []).map(c => Control.fromJson(c));
        } catch (error) {
            console.error('ControlService GET Error:', error);
            throw error;
        }
    }

    async create(propertyId, startDate, endDate) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    property_id: propertyId,
                    start_date: startDate,
                    end_date: endDate
                }),
            });

            const data = await this.handleResponse(response);
            return Control.fromJson(data.control);
        } catch (error) {
            console.error('ControlService CREATE Error:', error);
            throw error;
        }
    }

    async update(controlInstance) {
        try {
            const response = await fetch(`${this.baseUrl}/update`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(controlInstance.toJson()),
            });

            const data = await this.handleResponse(response);
            return Control.fromJson(data.control);
        } catch (error) {
            console.error('ControlService UPDATE Error:', error);
            throw error;
        }
    }
    
    async delete(id) {
        try {
            const response = await fetch(`${this.baseUrl}/delete`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ id }),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('ControlService DELETE Error:', error);
            throw error;
        }
    }
}

export default new ControlService();