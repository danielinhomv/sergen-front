import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { API_URL } from '@/environment/Api';


export const useSessionPropertyStore = defineStore('sessionProperty', () => {

    const isWorking = ref(false);
    const propertyId = ref(null);
    const protocolId = ref(null);
    const isWorked = computed(() => isWorking.value);
    const isLoaded = ref(false);
    const getPropertyId = computed(() => propertyId.value);
    const getProtocolId = computed(() => protocolId.value);
    const PREFIX = '/management/property';
    const baseUrl = `${API_URL}${PREFIX}`;

    async function fetchInitialWorkStatus(userId) {

        try {
            const response = await _sendRequestHttp('isWorked', userId, null);

            if (response.ok) {
                const data = await response.json();
                const active = data.active;

                if (active) {
                    isWorking.value = true;
                    propertyId.value = data.property_id;
                    protocolId.value = data.protocol_id;
                } else {
                    isWorking.value = false;
                    propertyId.value = null;
                    protocolId.value = null;
                }
            }

        } catch (error) {
            console.error("Error al cargar estado inicial del servidor:", error);
            isWorking.value = false;
            propertyId.value = null;
            protocolId.value = null;
        } finally {
            isLoaded.value = true;
        }

    }

    async function _processResponse(response) {
        if (!response.ok) {
            const errorData = await response.json;
            throw new Error(errorData)
        }
        const data = await response.json();
        return data;
    }

    async function startWork(selectedPropertyId, userId) {


        const response = await _sendRequestHttp('start-work', userId, selectedPropertyId);
        const dataProcesed = await _processResponse(response);

        const dataProcesedCurrentSession = dataProcesed.current_session;
        propertyId.value = dataProcesedCurrentSession.property_id;
        protocolId.value = dataProcesed.protocol_id;
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

    return {
        isWorked,
        getPropertyId,
        protocolId,
        getProtocolId,
        startWork,
        finishWork,
        isWorking,
        propertyId,
        isLoaded,
        fetchInitialWorkStatus
    }
},
    {
        persist:
        {
            paths: ['isWorking', 'propertyId']
        }
    }
)
