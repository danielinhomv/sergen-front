<template>
  <LayoutApp>
    <div class="container py-4" style="background-color: #eafaf1; min-height: 100vh;">
      <div class="row mb-4 align-items-center">
        <div class="col-md-4">
          <h2 class="text-success">Etapas de Protocolo</h2>
        </div>
      </div>

      <div class="row">
        <div class="col-md-3">
          <nav class="nav flex-column bg-white rounded shadow-sm p-3">
            <span class="fw-bold text-success mb-2">Procesos de Protocolo</span>
            <button
                v-for="(proceso, idx) in procesos"
                :key="proceso"
                class="btn mb-2"
                :class="activeProceso === idx ? 'btn-success' : 'btn-outline-success'"
                @click="activeProceso = idx"
            >
              {{ proceso }}
            </button>
          </nav>
        </div>
       <div class="col-md-9">
            <div class="content-card bg-white rounded-4 shadow-lg p-5">
              <div v-if="activeProceso === null" class="d-flex flex-column align-items-center justify-content-center text-center">
                <i class="fas fa-satellite-dish text-success pulsate mb-4" style="font-size: 5rem;"></i>
                <h4 class="text-muted fw-light">Escaneando...</h4>
                <p class="text-muted mt-2">
                  Esperando la detección de un escaneo de vaca. La información del protocolo aparecerá aquí.
                </p>
              </div>
              <div v-else>
                <h4 class="text-success">{{ procesos[activeProceso] }}</h4>
                <!-- Contenido para el proceso seleccionado -->
                <slot :proceso="procesos[activeProceso]"></slot>
              </div>
            </div>
          </div>
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref } from 'vue';
import LayoutApp from '../LayoutApp.vue';

const procesos = [
    'Presincronización',
    'Ecografía',
    'Retiro de Implante',
    'Inseminación',
    'Ecografía de Confirmación',
    'Palpación General',
    'Parto'
];

const activeProceso = ref(null);
</script>

<style scoped>
body {
    background-color: #eafaf1;
}
</style>
