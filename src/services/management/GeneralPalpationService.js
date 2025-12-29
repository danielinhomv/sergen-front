import { API_URL } from '@/environment/Api';
import { GeneralPalpation } from '@/model/management/GeneralPalpation';

const PREFIX = '/management/general-palpation';

export class GeneralPalpationService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    /**
     * Coincide con Route::post('/get', ...)
     */
    async get(controlBovineId) {
        const response = await fetch(`${this.baseUrl}/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "control_bovine_id": controlBovineId,
            })
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de palpación general');
        }

        const data = await response.json();
        if (!data) return null;

        return GeneralPalpation.fromJson(data);
    }

    /**
     * Coincide con Route::post('/create', ...)
     */
    async create(item) {
        const response = await fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item.toJson()),
        });

        if (!response.ok) throw new Error('Error al crear el registro de palpación');
        return await response.json();
    }

    /**
     * Coincide con Route::post('/update', ...)
     * Se cambió PUT por POST y se eliminó el ID de la URL.
     */
    async update(id, item) {
        const response = await fetch(`${this.baseUrl}/update`, {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                ...item.toJson()
            }),
        });

        if (!response.ok) throw new Error('Error al actualizar el registro de palpación');
        return await response.json();
    }
}