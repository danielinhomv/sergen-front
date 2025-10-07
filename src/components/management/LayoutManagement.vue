<template>
  <LayoutApp>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-success">Iniciando nuevo protocolo</p>
    </div>

    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080">
      <div id="liveToast" class="toast align-items-center w-100" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div id="toast-icon" class="toast-body me-2">
          </div>
          <div id="toast-message" class="toast-body flex-grow-1">
          </div>
          <button type="button" class="btn-close me-2 m-auto" insemination-bs-dismiss="toast"
            aria-label="Close"></button>
        </div>
      </div>
    </div>

    <div class="container py-4" style="background-color: #eafaf1; min-height: 100vh;">
      <div class="row mb-4 align-items-center">
        <div class="col-md-6">
          <h2 class="text-success">Reproducción y Genética</h2>
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-danger btn-lg shadow-sm" @click="confirmNewProtocol">
            <i class="fas fa-redo-alt me-2"></i> Comenzar De Nuevo
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3">
          <nav class="nav flex-column bg-white rounded shadow-sm p-3">
            <span class="fw-bold text-success mb-2">Etapas de Protocolo</span>
            <button v-for="(proceso) in etapas" :key="proceso" class="btn mb-2"
              :class="currentRouteName === etapaRoutes[proceso] ? 'btn-success' : 'btn-outline-success'"
              @click="goTomanagement(etapaRoutes[proceso])">
              {{ proceso }}
            </button>
          </nav>
        </div>
        <div class="col-md-9">
          <div class="bg-white rounded shadow-sm p-4">
            <h4 class="text-success">{{ getTitleFromRoute() }}</h4>
            <!-- El componente de la ruta se renderizará aquí -->
            <RouterView />
          </div>
        </div>
      </div>

      <!-- Modal de Confirmación -->
      <div v-if="showConfirmation" class="confirmation-overlay">
        <div class="confirmation-box bg-white rounded-4 shadow-lg p-4 text-center">
          <p class="mb-4">¿Estás seguro de que quieres iniciar un nuevo protocolo? Se eliminarán los datos del protocolo
            actual.</p>
          <div class="d-flex justify-content-center gap-3">
            <button class="btn btn-success" @click="startNewProtocol">Sí, continuar</button>
            <button class="btn btn-outline-danger" @click="showConfirmation = false">Cancelar</button>
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


const loading = ref(false);
const showConfirmation = ref(false);
const router = useRouter();
const route = useRoute();
const currentRouteName = computed(() => route.name);
const sessionPropertyStore = useSessionPropertyStore();

const etapas = [
  'Presincronización',
  'Ecografía',
  'Retiro de Implante',
  'Inseminación',
  'Ecografía de Confirmación',
  'Palpación General',
  'Parto'
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
    if (etapaRoutes[etapa] === currentRouteName.value) {
      return etapa;
    }
  }
  return "Selecciona una etapa"; // Título por defecto
}

function confirmNewProtocol() {
  showConfirmation.value = true;
}

async function startNewProtocol() {
  showConfirmation.value = false;
  loading.value = true;
  try {
    await sessionPropertyStore.startNewProtocol();
    loading.value = false;
    showToast('success', 'Se ha iniciado un nuevo protocolo!!');
  } catch (error) {
    loading.value = false;
    showToast('error', 'Ocurrió un error en el servidor. Revise su conexión e inténtelo más tarde.');

  }
}

function showToast(type, message) {
  const toastEl = document.getElementById('liveToast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');


  toastEl.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning');

  let iconHtml = '';

  if (type === 'success') {
    toastEl.classList.add('text-bg-success');
    iconHtml = '<i class="fas fa-check-circle fs-5"></i>';
  } else if (type === 'error') {
    toastEl.classList.add('text-bg-danger');
    iconHtml = '<i class="fas fa-times-circle fs-5"></i>';
  } else if (type === 'warning') {
    toastEl.classList.add('text-bg-warning');
    iconHtml = '<i class="fas fa-exclamation-triangle fs-5"></i>';
  }

  toastMessage.textContent = message;
  toastIcon.innerHTML = iconHtml;

  const toast = Toast.getInstance(toastEl) || new Toast(toastEl, { delay: 4000 });
  toast.show();
}

</script>

<style scoped>
body {
  background-color: #eafaf1;
}

.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.confirmation-box {
  width: 90%;
  max-width: 450px;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
</style>
