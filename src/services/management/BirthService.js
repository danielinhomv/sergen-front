import { API_URL } from '@/environment/Api';
import { Birth } from '@/model/management/Birth';

const PREFIX = '/management/birth';

export class BirthService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    async createBirth(birth) {
        const response = await fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(birth.toJson()),
        });

        if (!response.ok) throw new Error('Error al crear el registro de parto');
        return await response.json();
    }

    async updateBirth(id, birth) {
        const response = await fetch(`${this.baseUrl}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                ...birth.toJson()
            }),
        });

        if (!response.ok) throw new Error('Error al actualizar el registro de parto');
        return await response.json();
    }

    async get() {
        const response = await fetch(`${this.baseUrl}/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de parto');
        }

        const data = await response.json();
        if (!data) return null;

        return Birth.fromJson(data);
    }
}