import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { API_URL } from '@/environment/Api';


export const useSessionPropertyStore = defineStore('sessionProperty', () => {

    const isWorking = ref(false);
    const propertyId = ref(null);
    const isWorked = computed(() => isWorking.value);
    const getPropertyId = computed(() => propertyId.value);
    const PREFIX = '/management/property';
    const baseUrl = `${API_URL}${PREFIX}`;

    async function _processResponse(response) {
        if (!response.ok) {
            const errorData = await response.json;
            throw new Error(errorData)
        }
        const data = await response.json();
        const currentSession = data.current_session
        return currentSession;
    }

    async function startWork(selectedPropertyId, userId) {


        const response = await _sendRequestHttp('start-work', userId, selectedPropertyId);
        const dataProcesedCurrentSession = await _processResponse(response);

        propertyId.value = dataProcesedCurrentSession.property_id;
        isWorking.value = true;

    }

    async function finishWork(selectedPropertyId, userId) {
        const response = await _sendRequestHttp('finish-work', userId, selectedPropertyId);
        await _processResponse(response);
        isWorking.value = false;

    }

    async function _sendRequestHttp(valor, userId, selectedPropertyId) {
        try {
            const response = await fetch(`${baseUrl}/${valor}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "user_id": userId,
                    "property_id": selectedPropertyId
                })
            })
            return response;
        } catch (error) {
            console.log(error);
        }

    }

    return { isWorked, getPropertyId, startWork, finishWork , isWorking , propertyId }
},{ 
    persist:
    {
    paths: ['isWorking', 'propertyId'] 
    } 
})