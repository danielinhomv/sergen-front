<template>
<LayoutApp>
<div class="account-container">
<div class="account-card">
<h2 class="account-title">
<i class="fas fa-user-circle me-3"></i>
Gestión de Cuenta
</h2>
<form @submit.prevent="updateAccount">
<div class="form-group">
<label for="username">
<i class="fas fa-user me-2"></i>Usuario
</label>
<input v-model="form.username" id="username" type="text" required class="form-control" />
</div>

      <div class="form-group">
        <label for="current-password">
          <i class="fas fa-key me-2"></i>Contraseña actual
        </label>
        <input
          v-model="form.currentPassword"
          id="current-password"
          type="password"
          class="form-control"
        />
      </div>
      
      <div class="form-group" v-if="form.currentPassword">
        <label for="password">
          <i class="fas fa-lock me-2"></i>Nueva contraseña
        </label>
        <input
          v-model="form.password"
          id="password"
          type="password"
          class="form-control"
        />
      </div>

      <div class="form-group" v-if="form.currentPassword && form.password">
        <label for="confirmPassword">
          <i class="fas fa-lock me-2"></i>Confirmar contraseña
        </label>
        <input
          v-model="form.confirmPassword"
          id="confirmPassword"
          type="password"
          class="form-control"
        />
      </div>

      <div class="d-grid gap-2">
        <button type="submit" class="btn btn-update" :disabled="isButtonDisabled">
          <i class="fas fa-save me-2"></i>Actualizar cuenta
        </button>
      </div>
    </form>
  </div>
</div>

</LayoutApp>
</template>

<script setup>
import { ref, computed } from 'vue';
import LayoutApp from '../LayoutApp.vue';

const originalUsername = 'Usuario Ejemplo';
const form = ref({
username: originalUsername,
currentPassword: '',
password: '',
confirmPassword: ''
});

const isFormModified = computed(() => {
return form.value.username !== originalUsername || form.value.currentPassword.length > 0;
});

const isPasswordValid = computed(() => {
return form.value.password === form.value.confirmPassword;
});

const isButtonDisabled = computed(() => {
if (!isFormModified.value) {
return true;
}

if (form.value.currentPassword.length === 0) {
return true;
}

if (form.value.password.length > 0 && !isPasswordValid.value) {
return true;
}

// Deshabilita el botón si la nueva contraseña está vacía
if (form.value.currentPassword.length > 0 && form.value.password.length === 0) {
return true;
}

return false;
});

const updateAccount = () => {
if (isButtonDisabled.value) {
console.error('Por favor, revisa tus datos. El botón de actualizar está deshabilitado.');
return;
}

// Lógica de actualización de cuenta
console.log('Cuenta actualizada correctamente.');
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

.account-container {
min-height: 100vh;
display: flex;
align-items: center;
justify-content: center;
background: linear-gradient(135deg, #e6f4ea 0%, #b6e2c7 100%);
font-family: 'Poppins', sans-serif;
}

.account-card {
background: #fff;
border-radius: 16px;
box-shadow: 0 4px 24px rgba(67, 160, 71, 0.15);
padding: 2.5rem 2rem;
max-width: 450px;
width: 100%;
}

.account-title {
color: #388e3c;
text-align: center;
margin-bottom: 2rem;
font-weight: 700;
}

.form-group {
margin-bottom: 1.5rem;
}

label {
display: block;
margin-bottom: 0.5rem;
color: #388e3c;
font-weight: 500;
display: flex;
align-items: center;
}

.form-control {
width: 100%;
padding: 0.8rem;
border: 1px solid #b6e2c7;
border-radius: 8px;
font-size: 1rem;
background: #f6fff8;
transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
border-color: #43a047;
box-shadow: 0 0 0 0.2rem rgba(67, 160, 71, 0.25);
outline: none;
}

.btn-update {
padding: 0.8rem;
background: linear-gradient(90deg, #43a047 0%, #388e3c 100%);
color: #fff;
border: none;
border-radius: 8px;
font-size: 1.1rem;
font-weight: 600;
cursor: pointer;
transition: background 0.2s, transform 0.2s;
}

.btn-update:hover {
background: linear-gradient(90deg, #388e3c 0%, #43a047 100%);
transform: translateY(-2px);
}
</style>