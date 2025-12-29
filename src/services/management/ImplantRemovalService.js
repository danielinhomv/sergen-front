import { API_URL } from '@/environment/Api';
import { ImplantRemoval } from '@/model/management/ImplantRemoval';

const PREFIX = '/management/implant-retrieval';

export class ImplantRemovalService {
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
            throw new Error('Error al obtener los datos de retiro de implante');
        }

        const data = await response.json();
        if (!data) return null;

        return ImplantRemoval.fromJson(data);
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

        if (!response.ok) throw new Error('Error al registrar el retiro de implante');
        return await response.json();
    }

    /**
     * Coincide con Route::post('/update', ...)
     * Se eliminó el ID de la URL y se cambió PUT por POST.
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

        if (!response.ok) throw new Error('Error al actualizar el retiro de implante');
        return await response.json();
    }
}