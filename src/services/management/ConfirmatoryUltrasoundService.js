import { API_URL } from '@/environment/Api';
import { ConfirmatoryUltrasound } from '@/model/management/ConfirmatoryUltrasound';

const PREFIX = '/management/confirmatory-ultrasound';

export class ConfirmatoryUltrasoundService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    async list() {
        const response = await fetch(`${this.baseUrl}/all`);
        if (!response.ok) throw new Error('Error al listar');

        const data = await response.json();
        return data.map(item => ConfirmatoryUltrasound.fromJson(item));
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
