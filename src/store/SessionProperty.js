import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { API_URL } from '@/environment/Api';
import { User } from '@/model/management/User';


export const useSessionPropertyStore = defineStore('sessionProperty', () => {

    const PREFIX = '/management/';
    const baseUrl = `${API_URL}${PREFIX}`;
    const USER_PREFIX = '/user/';
    const userUrl = `${API_URL}${USER_PREFIX}`;

    const token = ref(null);
    const user = ref(null);
    const isWorking = ref(false);
    const propertyId = ref(null);
    const chipSerie = ref(null);
    const name = ref(null);
    const place = ref(null);
    const phone = ref(null);
    const owner = ref(null);
    const protocolId = ref(null);
    const isLoaded = ref(false);

    const bovine = ref(null);
    const controlBovineId = ref(null);

    const isAuthenticated = computed(() => !!token.value);
    const getUser = computed(() => user.value);
    const getToken = computed(() => token.value);
    const isWorked = computed(() => isWorking.value);
    const getPropertyId = computed(() => propertyId.value);
    const getName = computed(() => name.value);
    const getPlace = computed(() => place.value);
    const getPhone = computed(() => phone.value);
    const getOwner = computed(() => owner.value);
    const getProtocolId = computed(() => protocolId.value);
    const getChipSerie = computed(() => chipSerie.value);

    const getBovine = computed(() => bovine.value);
    const getControlBovineId = computed(() => controlBovineId.value);


   async function fetchInitialWorkStatus(userId) {
        try {
            const response = await _sendRequestHttp('property/isWorked', userId, null);

            if (response.ok) {
                const data = await response.json();
                if (data.active) {
                    isWorking.value = true;
                    propertyId.value = data.property_id;
                    name.value = data.name;
                    place.value = data.place;
                    phone.value = data.phone_number;
                    owner.value = data.owner_name;
                    protocolId.value = data.protocol_id;
                }
            }
        } catch (error) {
            console.error("Error al cargar estado inicial:", error);
        } finally {
            isLoaded.value = true;
        }
    }

    async function login(username, password) {
        try {
            const response = await fetch(`${userUrl}login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: username, password: password })
            });

            const data = await response.json();

            if (data.error) throw new Error(data.error);

            token.value = data.token;
            
            await fetchUserProfile();

            return { success: true };
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    async function fetchUserProfile() {
        if (!token.value) return;
        try {
            const response = await fetch(`${userUrl}get`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) throw new Error("Sesión inválida");
            
            const userData = await response.json();
            user.value = User.fromJson(userData);
        } catch (error) {
            logout();
        }
    }

    function logout() {
        token.value = null;
        user.value = null;
        isWorking.value = false;
        propertyId.value = null;
        protocolId.value = null;
        chipSerie.value = null;
        bovine.value = null;
        controlBovineId.value = null;
    }

    function setBovine(b) {
        bovine.value = b;
    }

    function setControlBovineId(id) {
        controlBovineId.value = id;
    }

    function clearBovine() {
        bovine.value = null;
        controlBovineId.value = null;
    }


    function setChipSerie(serie) {
        chipSerie.value = serie;
    }

    function onScanned() {
        return chipSerie.value !== null;
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


        const response = await _sendRequestHttp('property/start-work', userId, selectedPropertyId);
        const dataProcesed = await _processResponse(response);

        const dataProcesedCurrentSession = dataProcesed.current_session;
        propertyId.value = dataProcesedCurrentSession.property_id;
        name.value = dataProcesed.name;
        place.value = dataProcesed.place;
        phone.value = dataProcesed.phone_number;
        owner.value = dataProcesed.owner_name;
        protocolId.value = dataProcesed.protocol_id;
        isWorking.value = true;


    }

    async function finishWork(selectedPropertyId, userId) {

        const response = await _sendRequestHttp('property/finish-work', userId, selectedPropertyId);
        await _processResponse(response);

        isWorking.value = false;

    }

    async function startNewProtocol() {
        const response = await _sendRequestHttp('protocol/start', null, propertyId.value);
        const dataProcesed = await _processResponse(response);
        const protocol = dataProcesed.protocolo;
        protocolId.value = protocol.id;
    }


   async function _sendRequestHttp(endpoint, userId, selectedPropertyId) {
        const headers = { 'Content-Type': 'application/json' };
        if (getToken.value) {
            headers['Authorization'] = `Bearer ${token.value}`;
        }

        return await fetch(`${baseUrl}${endpoint}`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({
                "user_id": userId,
                "property_id": selectedPropertyId
            })
        });
    }

    return {
        token,
        user,
        getToken,
        isAuthenticated,
        getUser,
        login,
        logout,
        fetchUserProfile,
        isWorked,
        getPropertyId,
        getName,
        getPlace,
        getPhone,
        getOwner,
        protocolId,
        getProtocolId,
        startWork,
        finishWork,
        isWorking,
        propertyId,
        isLoaded,
        fetchInitialWorkStatus,
        startNewProtocol,
        chipSerie,
        getChipSerie,
        setChipSerie,
        onScanned,
        bovine,
        getBovine,
        setBovine,
        controlBovineId,
        getControlBovineId,
        setControlBovineId,
        clearBovine
    }
},
    {
        persist: {
            paths: [
                'token',
                'user', 
                'isWorking',
                'propertyId',
                'protocolId',
                'name',
                'place',
                'phone',
                'owner',
                'chipSerie',
                'bovine',
                'controlBovineId'
            ]
        }

    }
)
