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
        return inseminationList.map(item => Insemination.fromJson(item));
    }

    async listInseminations(controlBovineId) {
        try {
            const response = await fetch(`${this.baseUrl}/all`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    "control_bovine_id": controlBovineId,
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

    async editInsemination(id, insemination) {
        try {
            const response = await fetch(`${this.baseUrl}/update/${id}`, {
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
            const response = await fetch(`${this.baseUrl}/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ "id": id }),
            });
            return await this._processResponse(response);
        } catch (error) {
            console.error('Error al eliminar la inseminación:', error);
            throw error;
        }
    }
}