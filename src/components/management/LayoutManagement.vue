<template>
  <LayoutApp>
    <div class="management-fixed-wrapper">
      <header class="management-header flex-shrink-0">
        <div class="container-fluid pt-3 px-4">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
              <h2 class="main-process-title">Reproducción y Genética</h2>
              <p class="process-subtitle">Seguimiento de protocolos por animal</p>
            </div>
            <div class="rfid-gadget">
              <RFIDSerialClient />
            </div>
          </div>

          <div class="row">
            <div class="col-12">
              <nav class="etapas-horizontal-container pb-3">
                <div class="etapas-wrapper d-flex justify-content-between align-items-center px-2">
                  <div v-for="(proceso, index) in etapas" :key="proceso"
                    class="etapa-item-wrapper d-flex align-items-center flex-grow-1">

                    <button class="btn-etapa-premium"
                      :class="{ 'active': currentRouteName === etapaRoutes[proceso] }"
                      @click="goTomanagement(etapaRoutes[proceso])">
                      <div class="icon-container-step">
                        <span class="step-num">{{ index + 1 }}</span>
                        <div class="step-pulse"></div>
                      </div>
                      <span class="step-text">{{ proceso }}</span>
                    </button>

                    <div v-if="index < etapas.length - 1" class="step-line-premium">
                      <div class="line-fill"></div>
                    </div>
                  </div>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header>

      <main class="management-body flex-grow-1 overflow-hidden px-4 pb-4">
        <section class="h-100 animate__animated animate__fadeInUp">
          <div class="work-canvas shadow-lg">
            <div class="canvas-inner custom-scroll">
              <RouterView />
            </div>
          </div>
        </section>
      </main>
    </div>
  </LayoutApp>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import LayoutApp from '../LayoutApp.vue';
import RFIDSerialClient from '@/components/RFIDSerialClient.vue';

const router = useRouter();
const route = useRoute();
const currentRouteName = computed(() => route.name);

const etapas = [
  'Presincronización', 'Ecografía', 'Retiro de Implante',
  'Inseminación', 'Ecografía de Confirmación', 'Palpación General', 'Parto'
];

const etapaRoutes = {
  'Presincronización': 'presynchronization-management',
  'Ecografía': 'ultrasound-management',
  'Retiro de Implante': 'implant-removal-management',
  'Inseminación': 'insemination-management',
  'Ecografía de Confirmación': 'confirmatory-ultrasound-management',
  'Palpación General': 'general-palpation-management',
  'Parto': 'birth-management'
};

function goTomanagement(routeName) {
  router.push({ name: routeName });
}
</script>

<style scoped>
/* --- ESTRUCTURA GENERAL --- */
.management-fixed-wrapper {
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #f4f7f6; /* Gris muy claro para resaltar el blanco */
}

.management-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
  z-index: 10;
}

.main-process-title {
  font-weight: 800;
  color: #1a4731;
  font-size: 1.5rem;
  letter-spacing: -0.5px;
  margin: 0;
}

.process-subtitle {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}

/* --- STEPPER PREMIUM --- */
.etapas-horizontal-container {
  overflow-x: auto;
  scrollbar-width: none;
  padding-top: 10px;
}
.etapas-horizontal-container::-webkit-scrollbar { display: none; }

.etapas-wrapper { min-width: 1000px; }

.btn-etapa-premium {
  background: none;
  border: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 120px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 10px 0;
}

.icon-container-step {
  width: 40px;
  height: 40px;
  border-radius: 12px; /* Cuadrado redondeado moderno */
  background: #f1f5f9;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1.1rem;
  margin-bottom: 8px;
  position: relative;
  transition: 0.3s;
  border: 2px solid transparent;
}

.step-text {
  font-size: 0.7rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: 0.3s;
  text-align: center;
}

/* Línea Conectora */
.step-line-premium {
  height: 3px;
  background: #e2e8f0;
  flex-grow: 1;
  margin: 0 -20px;
  margin-top: -30px; /* Ajuste para centrar con el icono */
  border-radius: 10px;
  z-index: 1;
}

/* --- ESTADO ACTIVO --- */
.btn-etapa-premium.active .icon-container-step {
  background: #2d4a22;
  color: #c0da63;
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(45, 74, 34, 0.25);
}

.btn-etapa-premium.active .step-text {
  color: #2d4a22;
}

.btn-etapa-premium.active .step-pulse {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 12px;
  border: 2px solid #2d4a22;
  animation: pulse-border 2s infinite;
}

@keyframes pulse-border {
  0% { transform: scale(1); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}

/* --- CANVAS DE TRABAJO --- */
.management-body {
  padding-top: 25px;
}

.work-canvas {
  background: white;
  border-radius: 24px;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #edf2f7;
  overflow: hidden;
}

.canvas-inner {
  padding: 2rem;
  flex-grow: 1;
  overflow-y: auto;
}

/* --- SCROLL PERSONALIZADO --- */
.custom-scroll::-webkit-scrollbar { width: 6px; }
.custom-scroll::-webkit-scrollbar-track { background: transparent; }
.custom-scroll::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scroll::-webkit-scrollbar-thumb:hover { background: #94a3b8; }

/* Gadget RFID */
.rfid-gadget {
  background: #f8fafc;
  padding: 5px 15px;
  border-radius: 15px;
  border: 1px solid #e2e8f0;
}
</style>