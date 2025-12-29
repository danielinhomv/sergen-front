import { Bovine } from '@/model/management/Bovine';
import { API_URL } from '@/environment/Api';

const PREFIX = '/management/bovine';

export class BovineService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        this.baseUrl = baseUrl;
    }

    /**
     * Procesa la respuesta del servidor y convierte los datos en instancias de Bovine.
     * @param {Response} response 
     * @returns {Promise<Bovine[]>}
     */
    async _processResponse(response) {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error en la petición: ${response.status}`);
        }

        const data = await response.json();
        const bovineList = data.bovines;

        console.log(bovineList.map(item => Bovine.fromJson(item)));
        return bovineList.map(item => Bovine.fromJson(item));
    }

    async _processSingleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Error HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!data.bovine) return null;

        return Bovine.fromJson(data.bovine);
    }
    async getBySerie(serie) {
        try {
            const response = await fetch(`${this.baseUrl}/get-by-serie`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ serie })
            });

            return await this._processSingleResponse(response);

        } catch (error) {
            console.error('Error al buscar bovino por serie:', error);
            throw error;
        }
    }


    /**
     * Obtiene la lista de bovinos.
     * @returns {Promise<Bovine[]>}
     */
    async listBovines($propertyId) {
        try {
            const response = await fetch(`${this.baseUrl}/all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "property_id": $propertyId
                })
            });
            return await this._processResponse(response);
        } catch (error) {
            console.error('Error al obtener la lista de bovinos:', error);
            throw error;
        }
    }

    /**
     * Crea un nuevo bovino.
     * @param {Bovine} bovine 
     * @returns {Promise<Bovine[]>}
     */
    async createBovine(bovine) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bovine.toJson()),
            });
            return await this._processResponse(response);
        } catch (error) {
            console.error('Error al crear el bovino:', error);
            throw error;
        }
    }

    /**
     * Actualiza un bovino existente.
     * @param {Bovine} bovine 
     * @returns {Promise<Bovine[]>}
     */
    async editBovine(bovine) {
        try {
            const response = await fetch(`${this.baseUrl}/update`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...bovine.toJson(),
                    id: bovine.id
                }),
            });
            return await this._processResponse(response);
        } catch (error) {
            console.error('Error al editar el bovino:', error);
            throw error;
        }
    }

    /**
     * Elimina un bovino.
     * @param {number} id 
     * @returns {Promise<Bovine[]>}
     */
    async deleteBovine(id) {
        try {
            const response = await fetch(`${this.baseUrl}/delete`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                    {
                        "id": id
                    }
                ),
            });
            return await this._processResponse(response);
        } catch (error) {
            console.error('Error al eliminar el bovino:', error);
            throw error;
        }
    }
}

export default BovineService;
