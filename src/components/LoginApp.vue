<template>
    <div class="login-container">
        <div class="login-card">
            <div class="logo-section">
                <div class="logo-circle bg-sergen-green">
                    <i class="fas fa-cow text-white"></i>
                </div>
                <h2 class="sergen-title">Sergen</h2>
            </div>
            <form @submit.prevent="handleLogin">
                <div class="form-group">
                    <label for="username">Usuario</label>
                    <input
                        type="text"
                        id="username"
                        v-model="username"
                        required
                        placeholder="Ingrese su usuario"
                    />
                </div>
                <div class="form-group">
                    <label for="password">Contraseña</label>
                    <input
                        type="password"
                        id="password"
                        v-model="password"
                        required
                        placeholder="Ingrese su contraseña"
                    />
                </div>
                <button
                    class="login-btn"
                    type="submit"
                    :disabled="!isFormValid"
                >
                    Ingresar
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

// Propiedad computada para validar el formulario
const isFormValid = computed(() => {
  return username.value.trim().length > 0 && password.value.length >= 8;
});

function handleLogin() {
    // Aquí va la lógica de autenticación
    console.log(`Bienvenido, ${username.value}!`);
    router.push({ name: 'dashboard' });

}
</script>

<style scoped>
.login-container {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #e6f4ea 0%, #b6e2c7 100%);
}

.login-card {
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 24px rgba(34, 139, 34, 0.15);
    padding: 2.5rem 2rem;
    max-width: 350px;
    width: 100%;
    border: 2px solid #43a047;
}

.logo-section {
    text-align: center;
    margin-bottom: 2rem;
}

.logo-circle {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    margin: 0 auto;
}

.bg-sergen-green {
    background-color: #388e3c;
}

.text-white {
    color: #fff;
}

.fa-cow {
    font-size: 2.5rem;
}

.sergen-title {
    color: #388e3c;
    margin-top: 1rem;
    margin-bottom: 0;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
}

.login-title {
    color: #388e3c;
    text-align: center;
    margin-bottom: 1.5rem;
    font-family: 'Montserrat', sans-serif;
    font-weight: 700;
}

.form-group {
    margin-bottom: 1.2rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    color: #388e3c;
    font-weight: 500;
}

input {
    width: 100%;
    padding: 0.6rem;
    border: 1px solid #b6e2c7;
    border-radius: 8px;
    font-size: 1rem;
    background: #f6fff8;
    transition: border-color 0.2s;
}

input:focus {
    border-color: #43a047;
    outline: none;
}

.login-btn {
    width: 100%;
    padding: 0.8rem;
    background: linear-gradient(90deg, #43a047 0%, #388e3c 100%);
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

.login-btn:hover {
    background: linear-gradient(90deg, #388e3c 0%, #43a047 100%);
}

.login-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
}

@media (max-width: 600px) {
    .login-card {
        padding: 2rem 1.5rem;
    }
    .login-title {
        font-size: 1.5rem;
    }
}
</style>
