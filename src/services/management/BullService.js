import { API_URL } from '@/environment/Api';
import { Bull } from '@/model/management/Bull';

const PREFIX = '/management/bull';

export class BullService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    /**
     * El backend requiere un POST y el user_id en el cuerpo de la petición
     */
    async listBulls(userId = 2) {
        const response = await fetch(`${this.baseUrl}/all`, {
            method: 'POST', // Corregido a POST según tu Route::post
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ user_id: userId }) // Enviamos el user_id que espera el controlador
        });

        if (!response.ok) throw new Error('Error al listar toros');

        const data = await response.json();
        
        // Según tu backend, la lista viene en data.bovine
        if (data.error) throw new Error(data.error);
        
        return data.bovine.map(item => Bull.fromJson(item));
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
        const response = await fetch(`${this.baseUrl}/update`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id: id,
                ...bull.toJson()
            }),
        });

        if (!response.ok) throw new Error('Error al actualizar toro');
        return await response.json();
    }
}