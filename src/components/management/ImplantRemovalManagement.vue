<template>
  <div class="loading-container">
    <div class="spinner-container">
      <div class="pulsing-circle"></div>
    </div>
    <div class="text-container">
      <p class="loading-text">{{ loadingText }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const loadingText = ref('Escaneando...');
let intervalId = null;

// Array de textos para simular diferentes etapas de escaneo
const texts = [
  'Escaneando...',
  'Analizando datos...',
  'Conectando con el escáner...',
  'Procesando información...'
];

onMounted(() => {
  // Cambiar el texto cada 2 segundos
  let textIndex = 0;
  intervalId = setInterval(() => {
    textIndex = (textIndex + 1) % texts.length;
    loadingText.value = texts[textIndex];
  }, 2000);
});

onUnmounted(() => {
  // Limpiar el temporizador al desmontar el componente
  clearInterval(intervalId);
});
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  background-color: transparent;
  width: 100%;
  height: 100%;
}

.spinner-container {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 1rem;
}

.pulsing-circle {
  width: 100px;
  height: 100px;
  background-color: #388e3c;
  border-radius: 50%;
  opacity: 0.5;
  animation: pulse 2s infinite ease-out;
}

.loading-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: #388e3c;
  animation: fade 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  50% {
    transform: scale(1.1);
    opacity: 0;
  }
  100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
}

@keyframes fade {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
