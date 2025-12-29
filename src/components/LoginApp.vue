<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionPropertyStore } from '@/store/SessionProperty'; // Importamos el store

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const router = useRouter();
const sessionStore = useSessionPropertyStore();

// Propiedad computada para validar el formulario
const isFormValid = computed(() => {
    return username.value.trim().length > 0 && password.value.length >= 4; // Ajustado a 4 según tu necesidad
});

async function handleLogin() {
    if (!isFormValid.value) return;

    isLoading.value = true;
    errorMessage.value = '';

    try {
        const result = await sessionStore.login(username.value, password.value);

        if (result.success) {
            if (sessionStore.getUser?.id) {
                await sessionStore.fetchInitialWorkStatus(sessionStore.getUser.id);
            }

            if (sessionStore.isWorked) {
                router.push({ name: 'dashboard' });
            } else {
                router.push({ name: 'select-property' });
            }
        }
    } catch (error) {
        errorMessage.value = error.message || 'Error al conectar con el servidor';
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <div class="login-container">
        <div class="login-card">
            <div class="logo-section">
                <div class="logo-circle bg-sergen-green">
                    <i class="fas fa-cow text-white"></i>
                </div>
                <h2 class="sergen-title">Sergen</h2>
            </div>

            <div v-if="errorMessage"
                class="alert alert-danger py-2 small text-center animate__animated animate__shakeX">
                <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username">Usuario</label>
                    <input type="text" id="username" v-model="username" required :disabled="isLoading"
                        placeholder="Ingrese su usuario" />
                </div>
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input type="password" id="password" v-model="password" required :disabled="isLoading"
                        placeholder="Ingrese su contraseña" />
                </div>
                <button class="login-btn" type="submit" :disabled="!isFormValid || isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Verificando...' : 'Ingresar' }}
                </button>
            </form>
        </div>
    </div>
</template>

<style scoped>
/* ... Tus estilos anteriores se mantienen igual ... */

.alert-danger {
    border-radius: 8px;
    font-size: 0.85rem;
    margin-bottom: 1rem;
    border: none;
    background-color: #fce4ec;
    color: #c2185b;
}

.spinner-border-sm {
    width: 1rem;
    height: 1rem;
}

/* Animación opcional para el error */
.animate__shakeX {
    animation: shakeX 0.5s;
}

@keyframes shakeX {

    from,
    to {
        transform: translate3d(0, 0, 0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translate3d(-5px, 0, 0);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translate3d(5px, 0, 0);
    }
}
</style>