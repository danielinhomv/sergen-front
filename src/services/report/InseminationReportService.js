import { Insemination } from '@/model/management/Insemination';
import { API_URL } from '@/environment/Api';

const PREFIX = '/report/insemination'

export class InseminationReportService {

    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    async _processResponse(response) {

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error en la petición: ${response.status}`);
        }
        const data = await response.json();

        const inseminationList = data || [];

        console.log(inseminationList.map(item => Insemination.fromJson(item)));
        return inseminationList.map(item => Insemination.fromJson(item));

    }

    async getInseminationReport(request) {
        try {
            const response = await fetch(`${this.baseUrl}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(request),
            }
            );
            return await this._processResponse(response);

        } catch (error) {
            console.error('Error al obtener el reporte de inseminaciones:', error);
            throw error;
        }
    }
}

