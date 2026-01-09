<template>
  <LayoutApp>
    <div class="account-premium-container animate__animated animate__fadeIn">
      <div class="container py-5">
        
        <div class="d-flex align-items-center gap-3 mb-5">
          <div class="icon-badge-premium">
            <i class="fas fa-user-shield"></i>
          </div>
          <div>
            <h3 class="fw-bold text-dark m-0">Configuración de la Cuenta</h3>
            <p class="text-muted m-0">Administra tu perfil profesional y seguridad de acceso</p>
          </div>
        </div>

        <div class="row g-4">
          <div class="col-lg-4">
            <div class="detail-card-premium shadow-sm mb-4">
              <div class="card-premium-header">
                <h6 class="fw-bold m-0 text-uppercase small tracking-wider">Perfil del Usuario</h6>
              </div>
              <div class="card-premium-body text-center">
                <div class="profile-avatar-container mb-3">
                  <div class="avatar-circle">
                    {{ form.username.charAt(0).toUpperCase() }}
                  </div>
                </div>
                <h5 class="fw-bold text-dark mb-1">{{ form.username }}</h5>
                <span class="status-pill-base bg-success-soft text-success mb-4 d-inline-block">
                  <i class="fas fa-check-circle me-1"></i> Miembro Activo
                </span>
                
                <div class="premium-divider"></div>
                
                <div class="text-start mt-3">
                  <div class="mb-3">
                    <label class="label-premium">ROL DEL SISTEMA</label>
                    <p class="value-premium">Administrador de Propiedad</p>
                  </div>
                  <div class="mb-3">
                    <label class="label-premium">PLAN ACTUAL</label>
                    <div class="text-box-premium highlight d-flex align-items-center justify-content-between">
                      <span class="fw-bold text-success-premium">SaaS Premium Plus</span>
                      <i class="fas fa-crown text-warning"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-8">
            <div class="form-premium-card shadow-sm">
              <div class="form-header-premium mb-4 d-flex justify-content-between align-items-center">
                <div>
                  <h5 class="text-dark fw-bold m-0">Editar Credenciales</h5>
                  <p class="text-muted small">Cambia tu nombre de usuario o actualiza tu contraseña</p>
                </div>
                <i class="fas fa-user-edit text-success-premium fs-4"></i>
              </div>

              <form @submit.prevent="updateAccount">
                <div class="row mb-4">
                  <div class="col-12">
                    <label class="label-premium">NOMBRE DE USUARIO</label>
                    <div class="input-group-premium">
                      <i class="fas fa-user input-icon"></i>
                      <input 
                        v-model="form.username" 
                        type="text" 
                        class="form-control-premium" 
                        placeholder="Nombre de usuario"
                        required 
                      />
                    </div>
                  </div>
                </div>

                <div class="d-flex align-items-center gap-2 mb-4">
                  <div class="premium-line"></div>
                  <h6 class="m-0 fw-bold text-muted text-uppercase small">Seguridad de la Cuenta</h6>
                  <div class="premium-line"></div>
                </div>

                <div class="row g-3">
                  <div class="col-md-12">
                    <label class="label-premium">CONTRASEÑA ACTUAL</label>
                    <div class="input-group-premium">
                      <i class="fas fa-key input-icon"></i>
                      <input 
                        v-model="form.currentPassword" 
                        type="password" 
                        class="form-control-premium" 
                        placeholder="••••••••••••"
                      />
                    </div>
                    <p class="small text-muted mt-1">Obligatorio para cualquier cambio de seguridad</p>
                  </div>

                  <TransitionGroup name="fade-slide">
                    <div class="col-md-6" v-if="form.currentPassword" key="new-pass">
                      <label class="label-premium">NUEVA CONTRASEÑA</label>
                      <div class="input-group-premium">
                        <i class="fas fa-lock input-icon"></i>
                        <input 
                          v-model="form.password" 
                          type="password" 
                          class="form-control-premium" 
                          placeholder="Mínimo 8 caracteres"
                        />
                      </div>
                    </div>

                    <div class="col-md-6" v-if="form.currentPassword && form.password" key="confirm-pass">
                      <label class="label-premium">CONFIRMAR NUEVA CONTRASEÑA</label>
                      <div class="input-group-premium" :class="{ 'error-border': !isPasswordValid && form.confirmPassword }">
                        <i class="fas fa-check-double input-icon"></i>
                        <input 
                          v-model="form.confirmPassword" 
                          type="password" 
                          class="form-control-premium" 
                          placeholder="Repite la contraseña"
                        />
                      </div>
                      <span v-if="!isPasswordValid && form.confirmPassword" class="text-danger extra-small fw-bold">
                        Las contraseñas no coinciden
                      </span>
                    </div>
                  </TransitionGroup>
                </div>

                <div class="mt-5 d-flex justify-content-end">
                  <button 
                    type="submit" 
                    class="btn btn-success-premium px-5" 
                    :disabled="isButtonDisabled || isUpdating"
                  >
                    <i v-if="isUpdating" class="spinner-border spinner-border-sm me-2"></i>
                    <i v-else class="fas fa-save me-2"></i>
                    {{ isUpdating ? 'GUARDANDO...' : 'ACTUALIZAR CUENTA' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, computed } from 'vue';
import LayoutApp from '../LayoutApp.vue';

// En un entorno SaaS real, estos vendrían de tu sessionStore
const originalUsername = 'Admin_Hacienda';
const isUpdating = ref(false);

const form = ref({
  username: originalUsername,
  currentPassword: '',
  password: '',
  confirmPassword: ''
});

// --- LÓGICA DE VALIDACIÓN ---

const isFormModified = computed(() => {
  return form.value.username !== originalUsername || form.value.currentPassword.length > 0;
});

const isPasswordValid = computed(() => {
  if (!form.value.password) return true;
  return form.value.password === form.value.confirmPassword;
});

const isButtonDisabled = computed(() => {
  // 1. Si no hay cambios, bloqueado
  if (!isFormModified.value) return true;
  
  // 2. Si se toca el username pero no se puso la clave actual para validar, bloqueado
  if (form.value.currentPassword.length === 0) return true;

  // 3. Si se quiere cambiar password pero no coinciden o la nueva está vacía
  if (form.value.password.length > 0) {
    if (!isPasswordValid.value || form.value.password.length < 6) return true;
  }

  // 4. Si puso la clave actual pero dejó la nueva vacía (y el username es el mismo)
  if (form.value.username === originalUsername && form.value.password.length === 0) return true;

  return false;
});

const updateAccount = async () => {
  isUpdating.value = true;
  
  // Simulación de API SaaS
  setTimeout(() => {
    console.log('Petición enviada al servidor SaaS:', form.value);
    isUpdating.value = false;
    alert('Cuenta actualizada con éxito');
    // Reiniciar campos de password
    form.value.currentPassword = '';
    form.value.password = '';
    form.value.confirmPassword = '';
  }, 1500);
};
</script>

<style scoped>
/* --- VARIABLES & BASE --- */
.account-premium-container {
  min-height: 100vh;
  background-color: #f8fafc;
}

.text-success-premium {
  color: #2d4a22 !important;
}

/* --- CARDS & ESTRUCTURA --- */
.detail-card-premium {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #edf2f7;
}

.card-premium-header {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  background: #fcfdfc;
}

.card-premium-body {
  padding: 1.5rem;
}

.form-premium-card {
  background: white;
  border-radius: 24px;
  padding: 2.5rem;
  border: 1px solid #edf2f7;
}

/* --- AVATAR & BADGES --- */
.avatar-circle {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #2d4a22 0%, #4a753a 100%);
  color: #c0da63;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 700;
  margin: 0 auto;
  box-shadow: 0 10px 20px rgba(45, 74, 34, 0.15);
}

.icon-badge-premium {
  width: 54px;
  height: 54px;
  background: #2d4a22;
  color: #c0da63;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.4rem;
}

/* --- FORMULARIOS PREMIUM --- */
.label-premium {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.8px;
  margin-bottom: 8px;
  display: block;
}

.input-group-premium {
  position: relative;
  display: flex;
  align-items: center;
}

.input-icon {
  position: absolute;
  left: 16px;
  color: #94a3b8;
  font-size: 1rem;
}

.form-control-premium {
  width: 100%;
  padding: 12px 16px 12px 45px;
  border: 2px solid #f1f5f9;
  border-radius: 14px;
  font-weight: 600;
  color: #1e293b;
  transition: all 0.3s ease;
  background: #f8fafc;
}

.form-control-premium:focus {
  border-color: #2d4a22;
  background: white;
  outline: none;
  box-shadow: 0 0 0 4px rgba(45, 74, 34, 0.05);
}

.error-border .form-control-premium {
  border-color: #ef4444;
}

/* --- BOTONES --- */
.btn-success-premium {
  background: #2d4a22;
  color: #c0da63;
  border: none;
  padding: 14px 32px;
  border-radius: 14px;
  font-weight: 700;
  transition: 0.3s;
  letter-spacing: 0.5px;
}

.btn-success-premium:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(45, 74, 34, 0.25);
  filter: brightness(1.1);
}

.btn-success-premium:disabled {
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
}

/* --- AUXILIARES --- */
.premium-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 20px 0;
}

.premium-line {
  flex: 1;
  height: 1px;
  background: #e2e8f0;
}

.status-pill-base {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.bg-success-soft {
  background-color: #dcfce7;
}

.value-premium {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.95rem;
}

.text-box-premium.highlight {
  background: #f0fdf4;
  border: 1px solid #dcfce7;
  padding: 10px 15px;
  border-radius: 12px;
}

.extra-small {
  font-size: 0.7rem;
}

/* --- ANIMACIONES --- */
.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s ease;
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>