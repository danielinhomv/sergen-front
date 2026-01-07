<template>
  <div class="d-flex" id="wrapper">
    
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-success-custom" role="status"></div>
      <p class="mt-3 text-success-custom fw-bold">{{ loadingText }}</p>
    </div>

    <div class="sidebar-premium d-flex flex-column" id="sidebar-wrapper">
      <div class="sidebar-heading-custom">
        <div class="logo-box animate__animated animate__fadeIn">
          <div class="logo-circle-premium">
            <i class="fas fa-cow"></i>
          </div>
          <h2 class="brand-name">Sergen</h2>
          <span class="brand-subtitle">Gestión Bovina</span>
        </div>
      </div>

      <div class="list-group list-group-flush flex-grow-1 px-3 mt-4">
        <router-link :to="{ name: 'dashboard' }" class="nav-link-premium mb-2">
          <i class="fas fa-chart-pie me-3"></i><span>Panel Principal</span>
        </router-link>
        
        <router-link :to="{ name: 'account-management' }" class="nav-link-premium mb-2">
          <i class="fas fa-user-shield me-3"></i><span>Mi Cuenta</span>
        </router-link>
        
        <router-link :to="{ name: 'property-management' }" class="nav-link-premium mb-2">
          <i class="fas fa-map-marked-alt me-3"></i><span>Propiedad Actual</span>
        </router-link>
        
        <router-link :to="{ name: 'insemination-management' }" class="nav-link-premium mb-2">
          <i class="fas fa-dna me-3"></i><span>Etapas</span>
        </router-link>
        
        <router-link :to="{ name: 'insemination-report' }" class="nav-link-premium mb-2">
          <i class="fas fa-file-invoice me-3"></i><span>Reportes</span>
        </router-link>
      </div>

      <div class="mt-auto p-4">
        <button @click="openLogoutModal" class="btn-logout-sidebar">
          <i class="fas fa-power-off me-3"></i>Cerrar Sesión
        </button>
      </div>
    </div>

    <div id="page-content-wrapper" class="bg-main-light">
      <button class="btn-toggle-custom d-lg-none shadow" id="menu-toggle">
        <i class="fas fa-bars"></i>
      </button>
      
      <div class="container-fluid p-0">
        <div class="content-scroll custom-scroll">
          <slot></slot>
        </div>
      </div>
    </div>

    <div class="modal fade" id="logoutSidebarModal" tabindex="-1" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg rounded-custom-28 overflow-hidden">
          <div class="elegant-modal-header bg-dark-gradient">
            <div class="elegant-icon-circle-dark">
              <i class="fas fa-sign-out-alt"></i>
            </div>
          </div>
          
          <div class="elegant-modal-body p-4 pt-5 text-center">
            <h4 class="fw-bold text-dark mt-2">¿Cerrar Sesión?</h4>
            <p class="text-muted small px-2">
              Estás por salir de la plataforma. Asegúrate de haber guardado todos tus cambios.
            </p>
          </div>
          
          <div class="elegant-modal-footer p-4 pt-0 d-flex flex-column gap-2">
            <button class="btn-elegant-dark" @click="executeLogout">
              SALIR AHORA
            </button>
            <button class="btn-elegant-light" data-bs-dismiss="modal">
              CANCELAR
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Modal } from 'bootstrap';
import { useSessionPropertyStore } from '@/store/SessionProperty';

const router = useRouter();
const sessionStore = useSessionPropertyStore();

const isLoading = ref(false);
const loadingText = ref('Cargando...');

const openLogoutModal = () => {
  const modalEl = document.getElementById('logoutSidebarModal');
  const modal = new Modal(modalEl);
  modal.show();
};

const executeLogout = async () => {
  loadingText.value = 'Finalizando sesión...';
  isLoading.value = true;

  try {
    const modalEl = document.getElementById('logoutSidebarModal');
    const modalInstance = Modal.getInstance(modalEl);
    if (modalInstance) modalInstance.hide();

    await sessionStore.logout();
    router.replace({ name: 'login' });
  } catch (error) {
    console.error('Logout error:', error);
    router.replace({ name: 'login' });
  }
};

onMounted(() => {
  const toggleButton = document.getElementById('menu-toggle');
  const wrapper = document.getElementById('wrapper');
  if (toggleButton && wrapper) {
    toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      wrapper.classList.toggle('toggled');
    });
  }
});
</script>

<style scoped>
/* --- SIDEBAR PREMIUM --- */
#sidebar-wrapper {
  width: 280px;
  min-height: 100vh;
  background: linear-gradient(180deg, #2d4a22 0%, #1b3014 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.sidebar-heading-custom {
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.logo-circle-premium {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #c0da63;
  margin: 0 auto 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-name {
  color: white;
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0;
  font-size: 1.6rem;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

/* --- NAV LINKS --- */
.nav-link-premium {
  display: flex;
  align-items: center;
  padding: 14px 20px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 16px;
  font-weight: 600;
  transition: 0.3s;
}

.nav-link-premium i {
  font-size: 1.2rem;
  width: 25px;
  transition: 0.3s;
}

.nav-link-premium:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link-premium.router-link-exact-active {
  background: #c0da63;
  color: #1b3014;
  box-shadow: 0 10px 20px -5px rgba(192, 218, 99, 0.3);
}

.btn-logout-sidebar {
  width: 100%;
  padding: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  color: #ff8e8e;
  font-weight: 700;
  text-align: left;
  transition: 0.3s;
}

.btn-logout-sidebar:hover {
  background: #e11d48;
  color: white;
}

/* --- PAGE CONTENT --- */
#page-content-wrapper {
  flex-grow: 1;
  height: 100vh;
  overflow: hidden;
  background: #f8fafc;
}

.content-scroll {
  height: 100vh;
  overflow-y: auto;
  padding: 20px;
}

.btn-toggle-custom {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1100;
  width: 45px;
  height: 45px;
  border-radius: 12px;
  background: white;
  border: none;
  color: #2d4a22;
}

/* --- MODAL ELEGANTE (CERRAR SESIÓN) --- */
.bg-dark-gradient {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.elegant-icon-circle-dark {
  width: 66px;
  height: 66px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  color: #1e293b;
  position: absolute;
  bottom: -33px;
  box-shadow: 0 10px 15px rgba(0,0,0,0.1);
}

.rounded-custom-28 { border-radius: 28px !important; }

.btn-elegant-dark {
  background: #1e293b;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 14px;
  font-weight: 700;
  transition: 0.3s;
}

.btn-elegant-dark:hover { background: #000; transform: translateY(-2px); }

.btn-elegant-light {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 14px;
  border-radius: 14px;
  font-weight: 700;
  transition: 0.3s;
}

/* --- LOADING OVERLAY --- */
.loading-overlay {
  position: fixed; inset: 0; background: rgba(255, 255, 255, 0.85);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  z-index: 9999; backdrop-filter: blur(4px);
}
.text-success-custom { color: #2d4a22; }

/* --- RESPONSIVE --- */
@media (max-width: 991.98px) {
  #sidebar-wrapper {
    position: fixed;
    margin-left: -280px;
  }
  #wrapper.toggled #sidebar-wrapper {
    margin-left: 0;
  }
}

.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
</style>