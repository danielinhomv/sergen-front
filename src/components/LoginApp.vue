<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionPropertyStore } from '@/store/SessionProperty';

const username = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const router = useRouter();
const sessionStore = useSessionPropertyStore();

const isFormValid = computed(() => {
    return username.value.trim().length > 0 && password.value.length >= 4;
});

async function handleLogin() {
    if (!isFormValid.value) return;

    isLoading.value = true;
    errorMessage.value = '';

    try {
        const result = await sessionStore.login(username.value, password.value);

        if (result.success) {

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
        <div class="background-overlay"></div>
        <div class="cow-pattern"></div>
        
        <div class="login-card">
            <div class="logo-section">
                <div class="logo-circle bg-sergen-green">
                    <i class="fas fa-cow text-white"></i>
                </div>
                <h2 class="sergen-title">Sergen</h2>
                <p class="sergen-subtitle">Gestión Ganadera Inteligente</p>
            </div>

            <div v-if="errorMessage"
                class="alert alert-danger py-2 small text-center animate__animated animate__shakeX">
                <i class="fas fa-exclamation-triangle me-2"></i>{{ errorMessage }}
            </div>

            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username">Usuario</label>
                    <div class="input-wrapper">
                        <i class="fas fa-user input-icon"></i>
                        <input type="text" id="username" v-model="username" required :disabled="isLoading"
                            placeholder="Ingrese su usuario" />
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <div class="input-wrapper">
                        <i class="fas fa-lock input-icon"></i>
                        <input type="password" id="password" v-model="password" required :disabled="isLoading"
                            placeholder="Ingrese su contraseña" />
                    </div>
                </div>

                <button class="login-btn" type="submit" :disabled="!isFormValid || isLoading">
                    <span v-if="isLoading" class="spinner-border spinner-border-sm me-2"></span>
                    {{ isLoading ? 'Verificando...' : 'Ingresar' }}
                </button>
            </form>
            
            <div class="login-footer">
                <p>&copy; 2026 Sergen App</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* 1. Contenedor con degradado de horizonte (Cielo a Pasto) */
.login-container {
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    background: linear-gradient(to bottom, #e3f2fd 0%, #F8F4E6 50%, #c5e1a5 100%);
}

/* 2. Patrón de siluetas de vacas sutiles */
.cow-pattern {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0.04;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 100 100'%3E%3Cpath d='M80 50c0-10-5-15-15-15h-5c-2-5-8-10-15-10s-13 5-15 10h-5c-10 0-15 5-15 15v5c0 5 5 10 10 10v10c0 5 5 5 5 0v-10h20v10c0 5 5 5 5 0v-10h10c5 0 10-5 10-10v-5z' fill='%234F7B3A'/%3E%3C/svg%3E");
    background-size: 120px 120px;
    animation: slideBackground 60s linear infinite;
}

@keyframes slideBackground {
    from { background-position: 0 0; }
    to { background-position: 500px 500px; }
}

/* 3. Desenfoque ambiental */
.background-overlay {
    position: absolute;
    width: 120%;
    height: 120%;
    background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0) 70%);
    filter: blur(40px);
    pointer-events: none;
}

/* 4. Tarjeta de Login */
.login-card {
    position: relative;
    z-index: 10;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(8px);
    padding: 2.5rem;
    border-radius: 28px;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
    width: 100%;
    max-width: 420px;
    border: 1px solid rgba(255, 255, 255, 0.6);
    text-align: center;
}

.logo-section {
    margin-bottom: 2rem;
}

.logo-circle {
    width: 75px;
    height: 75px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem;
    font-size: 2.2rem;
    box-shadow: 0 8px 20px rgba(79, 123, 58, 0.25);
}

.bg-sergen-green { background-color: #4F7B3A; }

.sergen-title {
    color: #3e2723;
    font-weight: 800;
    font-size: 2.2rem;
    margin: 0;
    letter-spacing: -1px;
}

.sergen-subtitle {
    color: #795548;
    font-size: 0.9rem;
    font-weight: 500;
    margin-top: 5px;
}

/* Formulario e Inputs */
.form-group {
    margin-bottom: 1.2rem;
    text-align: left;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    color: #5d4037;
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
}

.input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
}

.input-icon {
    position: absolute;
    left: 15px;
    color: #a1887f;
    font-size: 0.9rem;
}

.form-group input {
    width: 100%;
    padding: 0.8rem 1rem 0.8rem 2.8rem;
    border: 2px solid #eee;
    border-radius: 12px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: #fff;
}

.form-group input:focus {
    outline: none;
    border-color: #4F7B3A;
    box-shadow: 0 0 0 4px rgba(79, 123, 58, 0.1);
}

.login-btn {
    width: 100%;
    padding: 1rem;
    background-color: #4F7B3A;
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.login-btn:hover:not(:disabled) {
    background-color: #3e612e;
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(79, 123, 58, 0.3);
}

.login-btn:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
}

.alert-danger {
    background-color: #ffebee;
    color: #c62828;
    border-radius: 12px;
    border: none;
    margin-bottom: 1.5rem;
}

.login-footer {
    margin-top: 2rem;
    font-size: 0.75rem;
    color: #a1887f;
}

/* Animaciones */
.animate__shakeX { animation: shakeX 0.5s; }

@keyframes shakeX {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-8px); }
    75% { transform: translateX(8px); }
}

@media (max-width: 480px) {
    .login-card {
        padding: 2rem 1.5rem;
        max-width: 90%;
        border-radius: 20px;
    }
}
</style>