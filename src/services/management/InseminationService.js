import { Insemination } from '@/model/management/Insemination';
import { API_URL } from '@/environment/Api';

const PREFIX = '/management/insemination'

export class InseminationService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }


    async _processResponse(response) {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || `Error en la petición: ${response.status}`);
        }
        const data = await response.json();

        const inseminationList = data.insemination || data.inseminations || [];

        console.log(inseminationList.map(item => Insemination.fromJson(item)));
        return inseminationList.map(item => Insemination.fromJson(item));

    }

    async listInseminations() {
        try {
            const response = await fetch(`${this.baseUrl}/all`, {
                method: 'POST',
                headers: {
                    // 'Authorization': 'Bearer TU_TOKEN_AQUI', // Si es necesario
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "control_bovine_id": 3,
                }),

            });
            return await this._processResponse(response);

        } catch (error) {
            console.error('Error al obtener la lista de inseminaciones:', error);
            throw error;
        }
    }

    async createInsemination(insemination) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(insemination.toJson()),
            });
            return await this._processResponse(response);
        } catch (error) {
            console.error('Error al crear la inseminación:', error);
            throw error;
        }
    }

    async editInsemination(id,insemination) {
        try {
            const url = `${this.baseUrl}/update/${id}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(insemination.toJson()),
            });
            return await this._processResponse(response);
        } catch (error) {
            console.error('Error al editar la inseminación:', error);
            throw error;
        }
    }


    async deleteInsemination(id) {
        try {
            const url = `${this.baseUrl}/delete`;
            const response = await fetch(url, {
                method: 'POST',
                 headers: {
                    // 'Authorization': 'Bearer TU_TOKEN_AQUI', // Si es necesario
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "id": id,
                }),
            });
            return await this._processResponse(response);
        } catch (error) {
            console.error('Error al eliminar la inseminación:', error);
            throw error;
        }
    }
}