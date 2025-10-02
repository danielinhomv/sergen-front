import axios from 'axios';
import Property from '@/model/management/Property'; // Ajusta la ruta según tu proyecto

import {API_URL} from '@/environment/Api';

const PREFIX = '/management/property'

class PropertyService {

    static async list(user_id = 1) {
        try {
            const response = await axios.get(`${API_URL}${PREFIX}/list`, {
                params: user_id ? { user_id } : {}
            });
            return response.data.properties.map(p => new Property(p));
        } catch (error) {
            console.error('Error listando propiedades:', error.response?.data || error);
            throw error;
        }
    }

    // Crear nueva propiedad
    static async create(property) {
        try {
            const response = await axios.post(`${API_URL}${PREFIX}/create`, property);
            return new Property(response.data.property || response.data);
        } catch (error) {
            console.error('Error creando propiedad:', error.response?.data || error);
            throw error;
        }
    }

    // Actualizar propiedad
    static async update(id, property) {
        try {
            const response = await axios.put(`${API_URL}${PREFIX}/update/${id}`, property);
            return new Property(response.data.property || response.data);
        } catch (error) {
            console.error('Error actualizando propiedad:', error.response?.data || error);
            throw error;
        }
    }

    // Eliminar propiedad
    static async delete(id) {
        try {
            const response = await axios.delete(`${API_URL}${PREFIX}/delete/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error eliminando propiedad:', error.response?.data || error);
            throw error;
        }
    }

    // Verificar si el nombre existe
    static async nameExists(name,user_id = 1) {
        try {
            const response = await axios.post(`${API_URL}${PREFIX}/name-exists`, { name , user_id});
            return response.data.exists;
        } catch (error) {
            console.error('Error verificando nombre:', error.response?.data || error);
            throw error;
        }
    }

    // Obtener propiedad por ID
    static async getById(id) {
        try {
            const response = await axios.get(`${API_URL}${PREFIX}/${id}`);
            return new Property(response.data.property || response.data);
        } catch (error) {
            console.error('Error obteniendo propiedad por ID:', error.response?.data || error);
            throw error;
        }
    }

}

export default PropertyService;
