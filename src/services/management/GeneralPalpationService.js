import { API_URL } from '@/environment/Api';
import { GeneralPalpation } from '@/model/management/GeneralPalpation';

const PREFIX = '/management/general-palpation';

export class GeneralPalpationService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

async get() {
    const response = await fetch(`${this.baseUrl}/get`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
    })

    if (!response.ok) {
        throw new Error('Error al obtener pre-sincronización')
    }

    const data = await response.json()
    if (!data) return null

    return GeneralPalpation.fromJson(data);
}

    async create(item) {
        const response = await fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.toJson()),
        });

        if (!response.ok) throw new Error('Error al crear');
        return await response.json();
    }

    async update(id, item) {
        const response = await fetch(`${this.baseUrl}/update/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.toJson()),
        });

        if (!response.ok) throw new Error('Error al actualizar');
        return await response.json();
    }

}
