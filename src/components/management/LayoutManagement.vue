<template>
  <LayoutApp>
    <div class="container py-4" style="background-color: #eafaf1; min-height: 100vh;">
      <div class="row mb-4 align-items-center">
        <div class="col-md-4">
          <h2 class="text-success">Reproducción y Genética</h2>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3">
          <nav class="nav flex-column bg-white rounded shadow-sm p-3">
            <span class="fw-bold text-success mb-2">Etapas de Protocolo</span>
            <button v-for="(proceso) in etapas" :key="proceso" class="btn mb-2"
              :class="currentRouteName === etapaRoutes[proceso] ? 'btn-success' : 'btn-outline-success'"
              @click="goToReport(etapaRoutes[proceso])">
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
    </div>
  </LayoutApp>
</template>

<script setup>
import { computed } from 'vue';
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
  // 'Ecografía': 'ultrasound-report',
  // 'Retiro de Implante': 'implant-removal-report',
  // 'Inseminación': 'insemination-report',
  // 'Ecografía de Confirmación': 'confirmatory-ultrasound-report',
  // 'Palpación General': 'general-palpation-report',
  // 'Parto': 'birth-report'
};

const router = useRouter();
const route = useRoute();

const currentRouteName = computed(() => route.name);

function goToReport(routeName) {
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
</script>

<style scoped>
body {
  background-color: #eafaf1;
}
</style>
