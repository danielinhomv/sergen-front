import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { API_URL } from '@/environment/Api';
import { User } from '@/model/management/User';


export const useSessionPropertyStore = defineStore('sessionProperty', () => {

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
    const protocolId = ref(null);  // el id de la gestion en curso
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

   async function logout() {
    try {
        if (token.value) {
            await fetch(`${userUrl}logout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token.value}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
        }
    } catch (error) {
        console.error("Error al invalidar token en servidor:", error);
    } finally {
        token.value = null;
        user.value = null;
    }
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

    async function startWork(selectedPropertyId, protocoloId, nameValue, placeValue, phoneValue, ownerValue) {

        isWorking.value = true;
        propertyId.value = selectedPropertyId;
        protocolId.value = protocoloId;
        name.value = nameValue;
        place.value = placeValue;
        phone.value = phoneValue;
        owner.value = ownerValue;
        isLoaded.value = true;
    }

    async function finishWork() {

        isWorking.value = false;
        propertyId.value = null;
        name.value = null;
        place.value = null;
        phone.value = null;
        owner.value = null;
        protocolId.value = null;
        isLoaded.value = false;
        chipSerie.value = null;
        bovine.value = null;
        controlBovineId.value = null;
        isLoaded.value = false;

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
