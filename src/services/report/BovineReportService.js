import { API_URL } from '@/environment/Api';
import { HttpService } from '@/services/HttpService';

const PREFIX = '/report';

export class BovineReportService extends HttpService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        super();
        this.baseUrl = baseUrl;
    }

    async getBovineHistory(bovineId, propertyId) {
        try {
            const response = await fetch(`${this.baseUrl}/bovine-history`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    bovine_id: bovineId,
                    property_id: propertyId
                }),
            });

            const data = await this.handleResponse(response);
            
            // Si la respuesta es un array, devolvemos el primer elemento
            if (Array.isArray(data) && data.length > 0) {
                return data[0];
            }
            return data;
        } catch (error) {
            console.error('BovineReportService INDIVIDUAL Error:', error);
            throw error;
        }
    }

    async getBovinesHistoryByProperty(propertyId) {
        try {
            const response = await fetch(`${this.baseUrl}/property-bovine-history`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ property_id: propertyId }),
            });

            return await this.handleResponse(response);
        } catch (error) {
            console.error('BovineReportService PROPERTY Error:', error);
            throw error;
        }
    }
}

export default new BovineReportService();