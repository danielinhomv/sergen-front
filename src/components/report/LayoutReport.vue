<template>
  <LayoutApp>
 <div class="container py-4" style="background-color: #eafaf1; min-height: 100vh;">
        <div class="row mb-4 align-items-center">
            <div class="col-md-4">
                <h2 class="text-success">Reporte de Protocolo</h2>
            </div>
            <div class="col-md-8">
                <form class="row g-2 justify-content-end">
                    <div class="col-auto">
                        <label for="fechaInicio" class="form-label mb-0 text-success">Fecha Inicio</label>
                        <input type="date" id="fechaInicio" v-model="fechaInicio" class="form-control border-success" />
                    </div>
                    <div class="col-auto">
                        <label for="fechaFin" class="form-label mb-0 text-success">Fecha Final</label>
                        <input type="date" id="fechaFin" v-model="fechaFin" class="form-control border-success" />
                    </div>

                </form>
            </div>
        </div>

        <div class="row">
            <div class="col-md-3">
                <nav class="nav flex-column bg-white rounded shadow-sm p-3">
                    <span class="fw-bold text-success mb-2">etapas de Protocolo</span>
                    <button
                        v-for="(proceso, idx) in etapas"
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
                <div class="bg-white rounded shadow-sm p-4">
                    <h4 class="text-success">{{ etapas[activeProceso] }}</h4>
                    <!-- Aquí va el contenido del reporte para el proceso seleccionado -->
                    <slot :proceso="etapas[activeProceso]" :fechaInicio="fechaInicio" :fechaFin="fechaFin"></slot>
                </div>
            </div>
        </div>
    </div>
  </LayoutApp>

</template>

<script setup>
import { ref } from 'vue';
import LayoutApp from '../LayoutApp.vue';

const fechaInicio = ref('');
const fechaFin = ref('');
const etapas = [
    'Presincronización',
    'Ecografía',
    'Retiro de Implante',
    'Inseminación',
    'Ecografía de Confirmación',
    'Palpación General',
    'Parto'
];
const activeProceso = ref(0);

</script>

<style scoped>
body {
    background-color: #eafaf1;
}
</style>