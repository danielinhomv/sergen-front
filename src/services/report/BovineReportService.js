import axios from 'axios';
import { API_URL } from '@/environment/Api'; 

// Endpoints
const PREFIX = '/report';
const ENDPOINT_BOVINE_INDIVIDUAL = '/bovine-history'; // Endpoint hipotético para un solo bovino
const ENDPOINT_PROPERTY_LIST = '/property-bovine-history'; // Endpoint basado en tu imagen

/**
 * Servicio para manejar las llamadas a la API relacionadas con los reportes
 * del historial de un bovino o una propiedad.
 */
class BovineReportService {

    /**
     * 1. Obtiene el historial completo de UN bovino (función original).
     * Asume que el endpoint espera 'bovine_id' y devuelve UN objeto { ... }.
     * * @param {number} bovineId El ID del bovino a consultar.
     * @param {number} propertyId El ID de la propiedad donde reside el bovino.
     * @returns {Promise<object>} Un objeto con el historial del bovino (inseminations, ultrasound, etc.).
     */
    static async getBovineHistory(bovineId, propertyId) {
        try {
            // Datos que se enviarán al endpoint INDIVIDUAL (el que usa tu componente)
            const requestBody = {
                bovine_id: bovineId,
                property_id: propertyId
            };

            const response = await axios.post(
                `${API_URL}${PREFIX}${ENDPOINT_BOVINE_INDIVIDUAL}`,
                requestBody
            );
            
            // Si la respuesta es un array de un solo elemento (común en APIs que usan listas),
            // devolvemos solo ese elemento.
            if (Array.isArray(response.data) && response.data.length > 0) {
                 return response.data[0]; 
            }
            
            // Si devuelve el objeto directamente
            return response.data; 

        } catch (error) {
            console.error('Error obteniendo el historial del bovino individual:', error.response?.data || error);
            throw error;
        }
    }

    /**
     * 2. Obtiene la lista de historiales de TODOS los bovinos de una propiedad.
     * Utiliza el endpoint `/property-bovine-history` basado en tu imagen.
     * * @param {number} propertyId El ID de la propiedad a consultar.
     * @returns {Promise<Array<object>>} Una lista de objetos, donde cada objeto es el historial de un bovino.
     */
    static async getBovinesHistoryByProperty(propertyId) {
        try {
            // Datos que se enviarán al endpoint de la LISTA
            const requestBody = {
                property_id: propertyId
            };

            const response = await axios.post(
                `${API_URL}${PREFIX}${ENDPOINT_PROPERTY_LIST}`,
                requestBody
            );
            
            // Devolvemos el array de historiales tal como viene de la API.
            return response.data; 

        } catch (error) {
            console.error('Error obteniendo el historial de bovinos por propiedad:', error.response?.data || error);
            throw error;
        }
    }
}

export { BovineReportService };