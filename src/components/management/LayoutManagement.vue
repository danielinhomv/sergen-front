<template>
  <LayoutApp>
    <div class="container py-4" style="background-color: #eafaf1; min-height: 100vh;">
      <div class="row mb-4 align-items-center">
        <div class="col-md-6">
          <h2 class="text-success">Reproducción y Genética</h2>
        </div>
        <div class="col-md-6 text-end">
          <button class="btn btn-danger btn-lg shadow-sm" @click="confirmNewProtocol">
            <i class="fas fa-plus-circle me-2"></i> Iniciar Nuevo Protocolo
          </button>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3">
          <nav class="nav flex-column bg-white rounded shadow-sm p-3">
            <span class="fw-bold text-success mb-2">Etapas de Protocolo</span>
            <button
              v-for="(proceso) in etapas"
              :key="proceso"
              class="btn mb-2"
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
          <p class="mb-4">¿Estás seguro de que quieres iniciar un nuevo protocolo? Se eliminarán los datos del protocolo actual.</p>
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

const showConfirmation = ref(false);

const router = useRouter();
const route = useRoute();

const currentRouteName = computed(() => route.name);

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

function startNewProtocol() {
  showConfirmation.value = false;
  // Lógica para iniciar un nuevo protocolo, por ejemplo, limpiar el estado o navegar a una nueva página.
  console.log('Nuevo protocolo iniciado. Datos anteriores eliminados.');
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
</style>
