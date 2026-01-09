<template>
  <div class="app-layout" id="wrapper">

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-border text-success-custom" role="status"></div>
      <p class="mt-3 text-success-custom fw-bold">{{ loadingText }}</p>
    </div>

    <aside class="sidebar-premium" id="sidebar-wrapper">
      <div class="sidebar-content d-flex flex-column h-100">
        <div class="sidebar-heading-custom">
          <div class="logo-box animate__animated animate__fadeIn">
            <div class="logo-circle-premium">
              <i class="fas fa-cow"></i>
            </div>
            <h2 class="brand-name">Sergen</h2>
            <span class="brand-subtitle">Gestión Bovina</span>
          </div>
        </div>

        <nav class="list-group list-group-flush flex-grow-1 px-3 mt-2">
          <router-link :to="{ name: 'dashboard' }" class="nav-link-premium mb-2">
            <i class="fas fa-chart-pie me-3"></i><span>Panel Principal</span>
          </router-link>

          <router-link :to="{ name: 'bull-management' }" class="nav-link-premium mb-2">
            <i class="fas fa-dna me-3"></i><span>Sementales</span>
          </router-link>

          <router-link :to="{ name: 'insemination-management' }" class="nav-link-premium mb-2">
            <i class="fas fa-layer-group me-3"></i><span>Etapas</span>
          </router-link>

          <router-link :to="{ name: 'property-management' }" class="nav-link-premium mb-2">
            <i class="fas fa-map-marked-alt me-3"></i><span>Propiedad Actual</span>
          </router-link>

          <router-link :to="{ name: 'account-management' }" class="nav-link-premium mb-2">
            <i class="fas fa-user-shield me-3"></i><span>Mi Cuenta</span>
          </router-link>

          <router-link :to="{ name: 'insemination-report' }" class="nav-link-premium mb-2">
            <i class="fas fa-file-invoice me-3"></i><span>Reportes</span>
          </router-link>
        </nav>

        <div class="p-4 mt-auto">
          <button @click="openLogoutModal" class="btn-logout-sidebar">
            <i class="fas fa-power-off me-3"></i>Cerrar Sesión
          </button>
        </div>
      </div>
    </aside>

    <main id="page-content-wrapper">
      <button class="btn-toggle-custom d-lg-none shadow" id="menu-toggle">
        <i class="fas fa-bars"></i>
      </button>

      <div class="d-flex flex-column h-100">

        <div class="main-scroll-area custom-scroll flex-grow-1">
          <div class="content-padding">
            <slot></slot>
          </div>
        </div>

        <footer class="static-footer bg-white border-top">
          <div class="container-fluid py-3 text-center">
            <p class="m-0 copyright-text">
              &copy; 2026 <strong>Sergen App</strong>
            </p>
          </div>
        </footer>
      </div>
    </main>

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
  if (toggleButton) {
    toggleButton.onclick = (e) => {
      e.preventDefault();
      wrapper.classList.toggle('toggled');
    };
  }
});
</script>

<style scoped>
/* --- ESTRUCTURA PRINCIPAL --- */
.app-layout {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: #f8fafc;
}

/* --- SIDEBAR --- */
#sidebar-wrapper {
  width: 280px;
  flex-shrink: 0;
  background: linear-gradient(180deg, #2d4a22 0%, #1b3014 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.sidebar-heading-custom {
  padding: 2.5rem 1.5rem;
  text-align: center;
}

.logo-circle-premium {
  width: 55px;
  height: 55px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #c0da63;
  margin: 0 auto 15px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.brand-name {
  color: white;
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0;
  font-size: 1.5rem;
}

.brand-subtitle {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 700;
}

.nav-link-premium {
  display: flex;
  align-items: center;
  padding: 13px 18px;
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  border-radius: 14px;
  font-weight: 600;
  transition: 0.3s;
}

.nav-link-premium:hover {
  color: white;
  background: rgba(255, 255, 255, 0.05);
}

.nav-link-premium.router-link-exact-active {
  background: #c0da63;
  color: #1b3014;
  box-shadow: 0 8px 15px rgba(192, 218, 99, 0.2);
}

.btn-logout-sidebar {
  width: 100%;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  color: #ff8e8e;
  font-weight: 700;
  text-align: left;
  transition: 0.3s;
}

.btn-logout-sidebar:hover {
  background: #e11d48;
  color: white;
  border-color: transparent;
}

/* --- CONTENIDO --- */
#page-content-wrapper {
  flex-grow: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  position: relative;
}

.main-scroll-area {
  overflow-y: auto;
}

.content-padding {
  padding: 0.5rem;
}

@media (max-width: 991.98px) {
  .content-padding {
    padding: 4.5rem 0.75rem 1rem;
    /* El primer valor es alto por el botón toggle móvil */
  }
}

/* --- FOOTER --- */
.static-footer {
  width: 100%;
  z-index: 5;
}

.copyright-text {
  font-size: 0.85rem;
  color: #94a3b8;
}

.copyright-text strong {
  color: #2d4a22;
}

/* --- MODAL ESTILO PREMIUM RECUPERADO --- */
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
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
}

.rounded-custom-28 {
  border-radius: 28px !important;
}

.btn-elegant-dark {
  background: #1e293b;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 14px;
  font-weight: 700;
  transition: 0.3s;
}

.btn-elegant-dark:hover {
  background: #000;
  transform: translateY(-2px);
}

.btn-elegant-light {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 14px;
  border-radius: 14px;
  font-weight: 700;
  transition: 0.3s;
}

/* --- RESPONSIVE --- */
.btn-toggle-custom {
  position: absolute;
  top: 15px;
  left: 15px;
  z-index: 1100;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: white;
  color: #2d4a22;
  border: none;
}

@media (max-width: 991.98px) {
  #sidebar-wrapper {
    position: absolute;
    left: -280px;
    height: 100%;
  }

  #wrapper.toggled #sidebar-wrapper {
    left: 0;
  }

  .content-padding {
    padding: 5rem 1.2rem 1.5rem;
  }
}

.custom-scroll::-webkit-scrollbar {
  width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

/* --- LOADING OVERLAY --- */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  backdrop-filter: blur(5px);
}

.text-success-custom {
  color: #2d4a22;
}
</style>