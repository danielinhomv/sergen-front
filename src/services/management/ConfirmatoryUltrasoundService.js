import { API_URL } from '@/environment/Api';
import { ConfirmatoryUltrasound } from '@/model/management/ConfirmatoryUltrasound';

const PREFIX = '/management/confirmatory-ultrasound';

export class ConfirmatoryUltrasoundService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    async list() {
        const response = await fetch(`${this.baseUrl}/all`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({})
        });

        if (!response.ok) throw new Error('Error al listar ecografías de confirmación');

        const data = await response.json();
        return data.map(item => ConfirmatoryUltrasound.fromJson(item));
    }

    async create(item) {
        const response = await fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.toJson()),
        });

        if (!response.ok) throw new Error('Error al crear ecografía de confirmación');
        return await response.json();
    }

    async update(id, item) {
        const response = await fetch(`${this.baseUrl}/update`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                ...item.toJson()
            }),
        });

        if (!response.ok) throw new Error('Error al actualizar ecografía de confirmación');
        return await response.json();
    }

    async delete(id) {
        const response = await fetch(`${this.baseUrl}/delete`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id }),
        });

        if (!response.ok) throw new Error('Error al eliminar ecografía de confirmación');
        return await response.json();
    }
}