import { Bovine } from '@/model/management/Bovine';
import { API_URL } from '@/environment/Api';
import { HttpService } from './HttpService'; // Importamos la clase base

const PREFIX = '/management/bovine';

export class BovineService extends HttpService {
    constructor(baseUrl = `${API_URL}${PREFIX}`) {
        super();
        this.baseUrl = baseUrl;
    }

    async getBySerie(serie) {
        try {
            const response = await fetch(`${this.baseUrl}/get-by-serie`, {
                method: 'POST',
                headers: this.getHeaders(), 
                body: JSON.stringify({ serie })
            });

            const data = await this.handleResponse(response);
            return data.bovine ? Bovine.fromJson(data.bovine) : null;
        } catch (error) {
            console.error('Error al buscar bovino por serie:', error);
            throw error;
        }
    }

    async listBovines(propertyId) {
        try {
            const response = await fetch(`${this.baseUrl}/all`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ "property_id": propertyId })
            });
            
            const data = await this.handleResponse(response);
            const list = data.bovines || [];
            return list.map(item => Bovine.fromJson(item));
        } catch (error) {
            console.error('Error al obtener la lista de bovinos:', error);
            throw error;
        }
    }

    async createBovine(bovine) {
        try {
            const response = await fetch(`${this.baseUrl}/create`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify(bovine.toJson()),
            });
            
            const data = await this.handleResponse(response);
            const list = data.bovines || [];
            return list.map(item => Bovine.fromJson(item));
        } catch (error) {
            console.error('Error al crear el bovino:', error);
            throw error;
        }
    }

    async editBovine(bovine) {
        try {
            const response = await fetch(`${this.baseUrl}/update`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    ...bovine.toJson(),
                    id: bovine.id
                }),
            });
            
            const data = await this.handleResponse(response);
            const list = data.bovines || [];
            return list.map(item => Bovine.fromJson(item));
        } catch (error) {
            console.error('Error al editar el bovino:', error);
            throw error;
        }
    }

    async deleteBovine(id) {
        try {
            const response = await fetch(`${this.baseUrl}/delete`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ "id": id }),
            });
            
            const data = await this.handleResponse(response);
            const list = data.bovines || [];
            return list.map(item => Bovine.fromJson(item));
        } catch (error) {
            console.error('Error al eliminar el bovino:', error);
            throw error;
        }
    }
}

export default BovineService;