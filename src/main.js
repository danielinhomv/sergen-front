import { createApp } from 'vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'; //para persistir la informacion en localstorage
import App from './App.vue'
import router from './router/index.js';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useSessionPropertyStore } from '@/store/SessionProperty.js';

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedState);


async function prepareApp() {

    app.use(router);
    app.use(pinia);

    await router.isReady(); //se espera a que las rutas esten listas

    const sessionPropertyStore = useSessionPropertyStore();

    const currentUserId = 1;
    await sessionPropertyStore.fetchInitialWorkStatus(currentUserId);
    const currentRoute = router.currentRoute.value;

    if (sessionPropertyStore.isWorked && currentRoute.name === 'select-property') {
        router.replace(
            { 
                name: 'dashboard',
                replace: true 
            }
        );
    } else if (!sessionPropertyStore.isWorked && currentRoute.meta.requiresAuth) {
        router.replace(
            { 
                name: 'select-property',
                replace: true 
             }
        );
    } 
    app.mount('#app');
}

prepareApp();
