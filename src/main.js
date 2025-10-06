import { createApp } from 'vue'
import { createPinia } from 'pinia';
import piniaPluginPersistedState from 'pinia-plugin-persistedstate'; // ¡IMPORTANTE!
import App from './App.vue'
import router from './router/index.js';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

const app = createApp(App);
const pinia = createPinia();

pinia.use(piniaPluginPersistedState);

app.use(router);
app.use(pinia);

app.mount('#app')
