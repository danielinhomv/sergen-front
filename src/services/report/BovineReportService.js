import axios from 'axios';
import { API_URL } from '@/environment/Api'; // Asegúrate de que esta ruta sea correcta

// La URL base del endpoint de reporte
// Según tu imagen, el endpoint completo es: http://127.0.0.1:8000/api/report/bovine-history
const PREFIX = '/report';
const ENDPOINT = '/bovine-history';

/**
 * Servicio para manejar las llamadas a la API relacionadas con los reportes
 * del historial de un bovino.
 */
class BovineReportService {

    /**
     * Obtiene el historial completo de un bovino (inseminaciones, ecografías, etc.).
     * * @param {number} bovineId El ID del bovino a consultar.
     * @param {number} propertyId El ID de la propiedad donde reside el bovino (como se requiere en el body).
     * @returns {Promise<object>} Un objeto con el historial del bovino (inseminations, ultrasound, etc.).
     */
    static async getBovineHistory(bovineId, propertyId) {
        try {
            // Datos que se enviarán en el cuerpo de la solicitud POST (JSON)
            const requestBody = {
                bovine_id: bovineId,
                property_id: propertyId
            };

            const response = await axios.post(
                `${API_URL}${PREFIX}${ENDPOINT}`,
                requestBody
            );
            
            // Dado que es un reporte y no estás usando un modelo, 
            // simplemente devolvemos la data tal como viene del backend.
            return response.data; 

        } catch (error) {
            console.error('Error obteniendo el historial del bovino:', error.response?.data || error);
            // Propagar el error para que el componente que lo llama pueda manejarlo
            throw error;
        }
    }
}

export { BovineReportService }; 
// Exportamos como nombrado por si luego quieres añadir más servicios al archivo