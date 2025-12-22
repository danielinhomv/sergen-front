<template>
  <LayoutApp>
    <div class="container-fluid fixed-report-layout">
      
      <div class="row pt-4 pb-3 align-items-center bg-custom-header flex-shrink-0">
        <div class="col-md-4">
          <h2 class="text-success m-0 fw-bold">Reporte de Protocolo</h2>
        </div>
        <div class="col-md-8">
          <form class="row g-3 justify-content-end align-items-center">
            <div class="col-auto d-flex flex-column align-items-center me-3">
              <label for="hoy" class="form-label mb-1 fw-bold text-success fs-5">HOY</label>
              <input type="checkbox" id="hoy" v-model="hoy" class="form-check-input checkbox-today" />
            </div>
            <div class="col-auto">
              <label for="fechaInicio" class="form-label mb-0 text-success small fw-bold">Fecha Inicio</label>
              <input type="date" id="fechaInicio" v-model="fechaInicio" class="form-control form-control-sm border-success" :disabled="hoy" />
            </div>
            <div class="col-auto">
              <label for="fechaFin" class="form-label mb-0 text-success small fw-bold">Fecha Final</label>
              <input type="date" id="fechaFin" v-model="fechaFin" class="form-control form-control-sm border-success" :disabled="hoy" />
            </div>
          </form>
        </div>
      </div>

      <div class="row main-content-flex flex-grow-1">
        <div class="col-md-3 h-100 py-2">
          <nav class="nav flex-column bg-white rounded shadow-sm p-3 h-100 border border-success-subtle overflow-auto">
            <span class="fw-bold text-success mb-2 border-bottom pb-2">Etapas de Protocolo</span>
            <button
              v-for="(proceso) in etapas"
              :key="proceso"
              class="btn mb-2 text-start btn-sm py-2"
              :class="currentRouteName === etapaRoutes[proceso] ? 'btn-success shadow-sm' : 'btn-outline-success border-0'"
              @click="goToReport(etapaRoutes[proceso])"
            >
              <i class="fas fa-chevron-right me-2 small"></i>{{ proceso }}
            </button>
          </nav>
        </div>

        <div class="col-md-9 h-100 py-2">
          <div class="report-scroll-box bg-white rounded shadow-sm p-4">
            <router-view 
              :fechaInicio="fechaInicio" 
              :fechaFin="fechaFin"
              :hoy="hoy"
            ></router-view>
          </div>
        </div>
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LayoutApp from '../LayoutApp.vue';

const fechaInicio = ref('');
const fechaFin = ref('');
const hoy = ref(true);

const etapas = [
  'Presincronización', 'Ecografía', 'Retiro de Implante', 
  'Inseminación', 'Ecografía de Confirmación', 'Palpación General', 'Parto'
];

const etapaRoutes = {
  'Presincronización': 'presynchronization-report',
  'Ecografía': 'ultrasound-report',
  'Retiro de Implante': 'implant-removal-report',
  'Inseminación': 'insemination-report',
  'Ecografía de Confirmación': 'confirmatory-ultrasound-report',
  'Palpación General': 'general-palpation-report',
  'Parto': 'birth-report'
};

const router = useRouter();
const route = useRoute();
const currentRouteName = computed(() => route.name);

function goToReport(routeName) {
  router.push({ name: routeName });
}
</script>

<style scoped>
/* Elimina el scroll global del navegador */
.fixed-report-layout {
  height: calc(100vh - 20px); /* Ajuste para que quepa en el slot de LayoutApp */
  display: flex;
  flex-direction: column;
  overflow: hidden; 
  background-color: #F8F4E6; /* Crema para mimetizar con el fondo */
}

.main-content-flex {
  overflow: hidden; /* Importante para que los hijos controlen su scroll */
  margin-bottom: 20px;
}

/* El contenedor del reporte es el único con scroll interno */
.report-scroll-box {
  height: 100%;
  overflow-y: auto; 
  border: 1px solid #d1e7dd;
}

/* Personalización de la barra de scroll */
.report-scroll-box::-webkit-scrollbar {
  width: 8px;
}
.report-scroll-box::-webkit-scrollbar-thumb {
  background: #28a745;
  border-radius: 10px;
}

.checkbox-today {
  width: 35px;
  height: 35px;
  accent-color: #28a745;
  cursor: pointer;
}
</style>