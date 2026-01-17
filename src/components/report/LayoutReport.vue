<!-- <template>
  <LayoutApp>
    <div class="container-fluid fixed-report-layout d-flex flex-column">
      
      <div class="row pt-3 pb-2 align-items-center bg-white border-bottom shadow-sm z-2 px-4 flex-shrink-0">
        <div class="col-md-4">
          <h2 class="report-title">Reproducción y Genética</h2>
          <p class="report-subtitle">Reportes de seguimiento por protocolo</p>
        </div>
        
        <div class="col-md-8">
          <form class="row g-2 justify-content-end align-items-center" @submit.prevent="aplicarFiltro">
            
            <div class="col-auto d-flex align-items-center bg-light rounded-pill px-3 py-1 border me-3">
              <label for="hoy" class="form-label mb-0 fw-bold text-success me-2" style="cursor:pointer; font-size: 0.8rem;">HOY</label>
              <div class="form-check form-switch m-0">
                <input class="form-check-input" type="checkbox" role="switch" id="hoy" v-model="hoy" style="cursor:pointer">
              </div>
            </div>

            <div class="col-auto">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-success text-white border-success"><i class="fas fa-calendar-alt"></i></span>
                <input type="date" v-model="fechaInicio" class="form-control border-success fw-bold text-secondary" :disabled="hoy" />
              </div>
            </div>

            <div class="col-auto text-secondary opacity-50">
              <i class="fas fa-arrow-right fa-sm"></i>
            </div>

            <div class="col-auto">
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-success text-white border-success"><i class="fas fa-calendar-alt"></i></span>
                <input type="date" v-model="fechaFin" class="form-control border-success fw-bold text-secondary" :disabled="hoy" />
              </div>
            </div>

            <div class="col-auto ms-2">
               <button 
                 class="btn btn-sm btn-success fw-bold px-3 d-flex align-items-center shadow-sm" 
                 :disabled="hoy"
                 type="submit"
               >
                 <i class="fas fa-filter me-2"></i> Filtrar
               </button>
             </div>

          </form>
        </div>
      </div>

      <div class="row bg-custom-cream flex-shrink-0 py-3 justify-content-center">
        <div class="col-12">
          <div class="stepper-wrapper px-4">
            <div class="stepper-line"></div>
            
            <div 
              v-for="(proceso) in etapas" 
              :key="proceso"
              class="stepper-item"
              @click="goToReport(etapaRoutes[proceso])"
            >
              <div 
                class="stepper-text-box"
                :class="currentRouteName === etapaRoutes[proceso] ? 'active-text' : 'inactive-text'"
              >
                {{ proceso }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="report-content-box flex-grow-1 p-4">
        <router-view />
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, provide, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LayoutApp from '../LayoutApp.vue'; // Ajusta la ruta

const fechaInicio = ref('');
const fechaFin = ref('');
const hoy = ref(false);
const filterTrigger = ref(0);

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

// Watcher: Trigger inmediato al marcar/desmarcar "hoy"
watch(hoy, (newVal) => {
  console.log('Checkbox "hoy" cambiado a:', newVal ? 'marcado' : 'desmarcado');
  filterTrigger.value++; // Dispara fetch en hijos
  if (newVal) {
    fechaInicio.value = '';
    fechaFin.value = '';
  }
});

// Función para botón "Filtrar"
function aplicarFiltro() {
  if (hoy.value) {
    console.log('Modo "hoy" activo: recarga automática ya hecha');
    return;
  }
  if (!fechaInicio.value || !fechaFin.value) {
    alert('Selecciona fechas de inicio y fin para filtrar.');
    return;
  }
  console.log("Filtrando desde", fechaInicio.value, "hasta", fechaFin.value);
  filterTrigger.value++; // Trigger recarga
}

// Computed para filtros dinámicos
const currentFilters = computed(() => {
  const base = {
    property_id: 21, // Fijo por defecto
    control_id: 1,   // Fijo por defecto
  };

  if (hoy.value) {
    return {
      ...base,
      filter_type: 'today',
      today: true,
      date_start: null,
      date_end: null,
    };
  } else if (fechaInicio.value && fechaFin.value) {
    return {
      ...base,
      filter_type: 'range',
      date_start: fechaInicio.value,
      date_end: fechaFin.value,
      today: false,
    };
  } else {
    return {
      ...base,
      filter_type: 'none',
      today: false,
      date_start: null,
      date_end: null,
    };
  }
});

// Provide a hijos
provide('reportFilters', { filters: currentFilters, trigger: filterTrigger });
</script>

<style scoped>
/* Fondos */
.bg-custom-cream {
  background-color: #F4F6F6; 
}

.fixed-report-layout {
  height: calc(100vh - 20px);
  overflow: hidden;
}

/* Títulos */
.report-title {
  font-weight: 800;
  color: #1a4731;
  font-size: 1.5rem;
  letter-spacing: -0.5px;
  margin: 0;
}

.report-subtitle {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
  font-weight: 500;
}

/* STEPPER */
.stepper-wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: auto;
  padding: 10px 0;
  scrollbar-width: none; 
}
.stepper-wrapper::-webkit-scrollbar { display: none; }

.stepper-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #e2e8f0;
  z-index: 0;
  transform: translateY(-50%);
}

.stepper-item {
  position: relative;
  z-index: 1;
  padding: 0 15px;
  flex: 0 0 auto;
}

.stepper-text-box {
  background-color: #F4F6F6;
  padding: 5px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #94a3b8;
  border-bottom: 2px solid transparent;
}

/* Estados Texto */
.active-text {
  color: #1a4731;
  font-weight: 800;
  transform: scale(1.1);
  background-color: #F4F6F6;
  border-bottom: 2px solid #1a4731;
}

.inactive-text:hover {
  color: #198754;
}

/* Contenido */
.report-content-box {
  overflow-y: auto;
}
.report-content-box::-webkit-scrollbar { width: 6px; }
.report-content-box::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }

.animate-fade {
  animation: fadeIn 0.4s ease-in-out;
}
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(5px); }
  to { opacity: 1; transform: translateY(0); }
}
</style> -->



<template>
  <LayoutApp>
    <div class="container-fluid fixed-report-layout d-flex flex-column">

      <div class="row pt-3 pb-2 align-items-center bg-white border-bottom shadow-sm z-2 px-4 flex-shrink-0">
        <div class="col-md-4">
          <h2 class="report-title">Reproducción y Genética</h2>
          <p class="report-subtitle">Reportes de seguimiento por protocolo</p>
        </div>

        <div class="col-md-8">
          <form class="row g-2 justify-content-end align-items-center" @submit.prevent="aplicarFiltro">

            <!-- Checkbox "hoy" (deshabilita dates y botón si marcado) -->
            <div class="col-auto d-flex align-items-center bg-light rounded-pill px-3 py-1 border me-3">
              <label for="hoy" class="form-label mb-0 fw-bold text-success me-2"
                style="cursor:pointer; font-size: 0.8rem;">HOY</label>
              <div class="form-check form-switch m-0">
                <input class="form-check-input" type="checkbox" role="switch" id="hoy" v-model="hoy"
                  style="cursor:pointer">
              </div>
            </div>

            <!-- Label + Fecha Inicio (deshabilitada si hoy marcado) -->
            <div class="col-auto d-flex align-items-center">
              <span class="date-label me-2">Desde:</span>
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-success text-white border-success"><i
                    class="fas fa-calendar-alt"></i></span>
                <input type="date" v-model="fechaInicio" class="form-control border-success fw-bold text-secondary"
                  :disabled="hoy" />
              </div>
            </div>

            <div class="col-auto text-secondary opacity-50 align-self-center">
              <i class="fas fa-arrow-right fa-sm"></i>
            </div>

            <!-- Label + Fecha Fin (deshabilitada si hoy marcado) -->
            <div class="col-auto d-flex align-items-center">
              <span class="date-label me-2">Hasta:</span>
              <div class="input-group input-group-sm">
                <span class="input-group-text bg-success text-white border-success"><i
                    class="fas fa-calendar-alt"></i></span>
                <input type="date" v-model="fechaFin" class="form-control border-success fw-bold text-secondary"
                  :disabled="hoy" />
              </div>
            </div>

            <div class="col-auto ms-2">
              <button class="btn btn-sm btn-success fw-bold px-3 d-flex align-items-center shadow-sm" :disabled="hoy"
                type="submit">
                <i class="fas fa-filter me-2"></i> Filtrar
              </button>
            </div>

          </form>
        </div>
      </div>

      <div class="row bg-custom-cream flex-shrink-0 py-3 justify-content-center">
        <div class="col-12">
          <div class="stepper-wrapper px-4">
            <div class="stepper-line"></div>

            <div v-for="(proceso) in etapas" :key="proceso" class="stepper-item"
              @click="goToReport(etapaRoutes[proceso])">
              <div class="stepper-text-box"
                :class="currentRouteName === etapaRoutes[proceso] ? 'active-text' : 'inactive-text'">
                {{ proceso }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="report-content-box flex-grow-1 p-4">
        <router-view />
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, provide, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useSessionPropertyStore } from '@/store/SessionProperty.js';
import LayoutApp from '../LayoutApp.vue';

const sessionPropertyStore = useSessionPropertyStore();
const fechaInicio = ref('');
const fechaFin = ref('');
const hoy = ref(false);
const filterTrigger = ref(0);

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

// Watcher solo en "hoy": Auto-trigger al marcar/desmarcar
watch(hoy, (newVal) => {
  console.log('Checkbox "hoy" cambiado a:', newVal ? 'marcado' : 'desmarcado');
  filterTrigger.value++;
  if (newVal) {

    fechaInicio.value = '';
    fechaFin.value = '';
  }
});

function aplicarFiltro() {
  if (hoy.value) {
    console.log('Modo "hoy" activo: recarga automática ya hecha');
    return;
  }

  if (!fechaInicio.value && !fechaFin.value) {
    alert('Ingresa al menos una fecha para filtrar.');
    return;
  }

  let filterType = 'none';
  if (fechaInicio.value && fechaFin.value) {
    filterType = 'range';
  } else if (fechaInicio.value) {
    filterType = 'from';
  } else if (fechaFin.value) {
    filterType = 'until';
  }

  console.log(`Aplicando filtro "${filterType}":`, { start: fechaInicio.value, end: fechaFin.value });
  filterTrigger.value++;
}

const currentFilters = computed(() => {
  
  const base = {
    property_id: sessionPropertyStore.getPropertyId,
    control_id: sessionPropertyStore.getProtocolId,
    today: hoy.value,
  };

  if (hoy.value) {
    return { ...base, filter_type: 'today', date_start: null, date_end: null };
  } else if (fechaInicio.value && fechaFin.value) {
    return { ...base, filter_type: 'range', date_start: fechaInicio.value, date_end: fechaFin.value };
  } else if (fechaInicio.value) {
    return { ...base, filter_type: 'from', date_start: fechaInicio.value, date_end: null };
  } else if (fechaFin.value) {
    return { ...base, filter_type: 'until', date_start: null, date_end: fechaFin.value };
  } else {
    return { ...base, filter_type: 'none', date_start: null, date_end: null };
  }
});

provide('reportFilters', { filters: currentFilters, trigger: filterTrigger });
</script>

<style scoped>
.bg-custom-cream {
  background-color: #F4F6F6;
}

.fixed-report-layout {
  height: calc(100vh - 20px);
  overflow: hidden;
}

/* Títulos */
.report-title {
  font-weight: 800;
  color: #1a4731;
  font-size: 1.5rem;
  letter-spacing: -0.5px;
  margin: 0;
}

.report-subtitle {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
  font-weight: 500;
}

/* STEPPER */
.stepper-wrapper {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  overflow-x: auto;
  padding: 10px 0;
  scrollbar-width: none;
}

.stepper-wrapper::-webkit-scrollbar {
  display: none;
}

.stepper-line {
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #e2e8f0;
  z-index: 0;
  transform: translateY(-50%);
}

.stepper-item {
  position: relative;
  z-index: 1;
  padding: 0 15px;
  flex: 0 0 auto;
}

.stepper-text-box {
  background-color: #F4F6F6;
  padding: 5px 10px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #94a3b8;
  border-bottom: 2px solid transparent;
}

/* Estados Texto */
.active-text {
  color: #1a4731;
  font-weight: 800;
  transform: scale(1.1);
  background-color: #F4F6F6;
  border-bottom: 2px solid #1a4731;
}

.inactive-text:hover {
  color: #198754;
}

/* Contenido */
.report-content-box {
  overflow-y: auto;
}

.report-content-box::-webkit-scrollbar {
  width: 6px;
}

.report-content-box::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.animate-fade {
  animation: fadeIn 0.4s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(5px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Leyendas de fechas */
.date-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1a4731;
  white-space: nowrap;
}
</style>