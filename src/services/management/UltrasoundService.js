import { API_URL } from '@/environment/Api';
import { Ultrasound } from '@/model/management/Ultrasound';

const PREFIX = '/management/ultrasound';

export class UltrasoundService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    async get(controlBovineId) {
        const response = await fetch(`${this.baseUrl}/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "control_bovine_id": controlBovineId,
            }),
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de ecografía');
        }

        const data = await response.json();
        if (!data) return null;

        return Ultrasound.fromJson(data);
    }

    async create(item) {
        const response = await fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.toJson()),
        });

        if (!response.ok) throw new Error('Error al registrar la ecografía');
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

        if (!response.ok) throw new Error('Error al actualizar la ecografía');
        return await response.json();
    }
}