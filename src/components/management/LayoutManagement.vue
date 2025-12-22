<template>
  <LayoutApp>
    <div class="management-fixed-wrapper">
      <div v-if="loading" class="loading-overlay">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-3 text-success fw-bold">Iniciando nuevo protocolo...</p>
      </div>

      <header class="management-header flex-shrink-0 bg-light-green">
        <div class="container-fluid pt-3 px-4">
          <div class="row align-items-center mb-3">
            <div class="col-md-6">
              <h2 class="text-success fw-bold m-0">Reproducción y Genética</h2>
            </div>
            <div class="col-md-6 text-end">
              <button class="btn btn-danger shadow-sm fw-bold px-4" @click="confirmNewProtocol">
                <i class="fas fa-redo-alt me-2"></i> Comenzar De Nuevo
              </button>
            </div>
          </div>
          
          <div class="row pb-2">
            <div class="col-12">
              <RFIDSerialClient />
            </div>
          </div>
        </div>
      </header>

      <main class="management-body flex-grow-1 overflow-hidden px-4 pb-3">
        <div class="row h-100 gx-3">
          
          <aside class="col-md-3 h-100 d-flex flex-column py-2">
            <nav class="bg-white rounded-4 shadow-sm p-3 border border-success-subtle d-flex flex-column h-100 overflow-hidden">
              <span class="fw-bold text-success mb-3 border-bottom pb-2 text-uppercase small" style="letter-spacing: 1px;">
                Etapas de Protocolo
              </span>
              
              <div class="flex-grow-1 overflow-y-auto overflow-x-hidden custom-scroll pe-1">
                <button v-for="(proceso) in etapas" :key="proceso" 
                  class="btn mb-2 text-start w-100 d-block py-2 px-3 fw-medium transition-btn"
                  :class="currentRouteName === etapaRoutes[proceso] ? 'btn-success shadow-sm' : 'btn-outline-success border-0'"
                  @click="goTomanagement(etapaRoutes[proceso])">
                  <i class="fas fa-chevron-right me-2 small"></i>{{ proceso }}
                </button>
              </div>
            </nav>
          </aside>

          <section class="col-md-9 h-100 py-2 d-flex flex-column">
            <div class="bg-white rounded-4 shadow-sm p-4 h-100 d-flex flex-column border border-success-subtle overflow-hidden">
              <div class="flex-shrink-0 mb-3 border-bottom pb-2">
                 <h4 class="text-success fw-bold m-0">{{ getTitleFromRoute() }}</h4>
              </div>
              
              <div class="flex-grow-1 overflow-y-auto overflow-x-hidden custom-scroll pe-2">
                <RouterView />
              </div>
            </div>
          </section>

        </div>
      </main>

      <div v-if="showConfirmation" class="confirmation-overlay">
        <div class="confirmation-box bg-white rounded-4 shadow-lg p-5 text-center">
          <i class="fas fa-exclamation-triangle text-warning fs-1 mb-3"></i>
          <h4 class="fw-bold">¿Reiniciar protocolo?</h4>
          <p class="text-muted mb-4">Se eliminarán los datos del protocolo actual.</p>
          <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-success px-4 fw-bold" @click="startNewProtocol">Sí, continuar</button>
            <button class="btn btn-outline-danger px-4 fw-bold" @click="showConfirmation = false">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LayoutApp from '../LayoutApp.vue';
import { useSessionPropertyStore } from '@/store/SessionProperty';
import { Toast } from 'bootstrap';
import RFIDSerialClient from '@/components/RFIDSerialClient.vue';

const loading = ref(false);
const showConfirmation = ref(false);
const router = useRouter();
const route = useRoute();
const currentRouteName = computed(() => route.name);
const sessionPropertyStore = useSessionPropertyStore();

const etapas = [
  'Presincronización', 'Ecografía', 'Retiro de Implante', 
  'Inseminación', 'Ecografía de Confirmación', 'Palpación General', 'Parto'
];

const etapaRoutes = {
  'Inseminación': 'insemination-management',
  'Ecografía': 'ultrasound-management',
  'Retiro de Implante': 'implant-removal-management',
  'Ecografía de Confirmación': 'confirmatory-ultrasound-management',
  'Palpación General': 'general-palpation-management',
  'Parto': 'birth-management',
  'Presincronización': 'presynchronization-management'
};

function goTomanagement(routeName) {
  router.push({ name: routeName });
}

function getTitleFromRoute() {
  for (const etapa in etapaRoutes) {
    if (etapaRoutes[etapa] === currentRouteName.value) return etapa;
  }
  return "Selecciona una etapa";
}

function confirmNewProtocol() { showConfirmation.value = true; }

async function startNewProtocol() {
  showConfirmation.value = false;
  loading.value = true;
  try {
    await sessionPropertyStore.startNewProtocol();
    loading.value = false;
    showToast('success', '¡Nuevo protocolo iniciado!');
  } catch (error) {
    loading.value = false;
    showToast('error', 'Error al reiniciar protocolo.');
  }
}

function showToast(type, message) {
  const toastEl = document.getElementById('liveToast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');
  toastEl.classList.remove('text-bg-success', 'text-bg-danger');
  if (type === 'success') {
    toastEl.classList.add('text-bg-success');
    toastIcon.innerHTML = '<i class="fas fa-check-circle fs-5"></i>';
  } else {
    toastEl.classList.add('text-bg-danger');
    toastIcon.innerHTML = '<i class="fas fa-times-circle fs-5"></i>';
  }
  toastMessage.textContent = message;
  const toast = new Toast(toastEl, { delay: 3000 });
  toast.show();
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* Evita que el layout se rompa y asegura el alto total */
.management-fixed-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Elimina scroll del navegador */
  background-color: #eafaf1; /* Color base de tus imágenes */
  font-family: 'Poppins', sans-serif;
}

.bg-light-green {
  background-color: #eafaf1;
}

/* Scrollbars personalizados */
.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
.custom-scroll::-webkit-scrollbar-thumb { background: #28a745; border-radius: 10px; }

/* Efecto en botones del menú */
.transition-btn { transition: all 0.2s ease; }
.transition-btn:hover { background-color: #508660; padding-left: 1.25rem; }

.loading-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(255, 255, 255, 0.85); display: flex; flex-direction: column;
  align-items: center; justify-content: center; z-index: 3000;
}

.confirmation-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(4px);
  display: flex; justify-content: center; align-items: center; z-index: 2000;
}
</style>