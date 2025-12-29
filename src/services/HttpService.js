import { useSessionPropertyStore } from '@/store/SessionProperty';

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
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || errorData.message || `Error HTTP: ${response.status}`);
        }
        return await response.json();
    }
}