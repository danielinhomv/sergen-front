import { createApp } from 'vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate';
import App from './App.vue'
import router from './router/index.js';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useSessionPropertyStore } from '@/store/SessionProperty.js';

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedState);

async function prepareApp() {
    app.use(pinia);
    app.use(router);

    const sessionStore = useSessionPropertyStore();
    const currentRoute = router.currentRoute.value;

    if (sessionStore.isAuthenticated) {
        await sessionStore.fetchUserProfile();
    }

    await router.isReady();

    if (!sessionStore.isAuthenticated) {
        if (currentRoute.meta.requiresAuth) {
            router.replace({ name: 'login' });
        }
    } else {
        if (sessionStore.isWorked) {
            if (currentRoute.name === 'login' || currentRoute.name === 'select-property') {
                router.replace({ name: 'dashboard' });
            }
        } else {
            if (currentRoute.meta.requiresWorkSession) {
                router.replace({ name: 'select-property' });
            }
        }
    }

    app.mount('#app');
}

prepareApp();