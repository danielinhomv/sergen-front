import { API_URL } from '@/environment/Api';
import { Bull } from '@/model/management/Bull';

const PREFIX = '/management/bull';

export class BullService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    async listBulls() {
        const response = await fetch(`${this.baseUrl}/all`);
        if (!response.ok) throw new Error('Error al listar toros');

        const data = await response.json();
        return data.map(item => Bull.fromJson(item));
    }

    async createBull(bull) {
        const response = await fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bull.toJson()),
        });

        if (!response.ok) throw new Error('Error al crear toro');
        return await response.json();
    }

    async updateBull(id, bull) {
        const response = await fetch(`${this.baseUrl}/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bull.toJson()),
        });

        if (!response.ok) throw new Error('Error al actualizar toro');
        return await response.json();
    }

}
