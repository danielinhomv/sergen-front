import { useSessionPropertyStore } from '@/store/SessionProperty';
import router from '@/router'; 

export class HttpService {
    
    getHeaders() {
        const sessionStore = useSessionPropertyStore();
        const token = sessionStore.getToken;

        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
        };
    }

    async handleResponse(response) {
        if (response.status === 401) {
            const sessionStore = useSessionPropertyStore();
            
            sessionStore.logout(); 

            router.replace({ name: 'login' }); //navigation solo funciona dentro de componentes por lo que se importa el router directamente

            throw new Error("Sesión expirada. Por seguridad, debe ingresar de nuevo.");
        }

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `Error HTTP: ${response.status}`);
        }

        return await response.json();
    }
}