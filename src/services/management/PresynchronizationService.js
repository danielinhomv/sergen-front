import { API_URL } from '@/environment/Api';
import { Presynchronization } from '@/model/management/Presynchronization';

// PREFIX coincide exactamente con Route::prefix('pre-sincronizacion')
const PREFIX = '/management/pre-sincronizacion';

export class PresynchronizationService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    /**
     * Coincide con Route::post('/get', ...)
     */
    async get() {
        const response = await fetch(`${this.baseUrl}/get`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({})
        });

        if (!response.ok) {
            throw new Error('Error al obtener los datos de pre-sincronización');
        }

        const data = await response.json();
        if (!data) return null;

        return Presynchronization.fromJson(data);
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

        if (!response.ok) throw new Error('Error al registrar la pre-sincronización');
        return await response.json();
    }

    /**
     * Coincide con Route::post('/update', ...)
     * Se cambió PUT por POST y se eliminó el ID de la URL para cumplir con tu estándar de seguridad.
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

        if (!response.ok) throw new Error('Error al actualizar la pre-sincronización');
        return await response.json();
    }
}