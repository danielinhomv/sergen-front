<template>
  <LayoutApp>
    <div class="report-section">
      <h2>Generar Reporte</h2>
      <div class="input-options">
        <button
          class="mic-btn"
          :class="{ recording: isRecording }"
          @click="toggleRecording"
          :aria-label="isRecording ? 'Detener grabación' : 'Iniciar grabación'"
        >
          <span v-if="!isRecording">🎤</span>
          <span v-else>⏹️</span>
        </button>
        <span v-if="isRecording" class="recording-text">Grabando...</span>
        <textarea
          v-model="reportText"
          placeholder="Escribe aquí tu reporte o usa el micrófono"
          rows="3"
          class="report-textarea"
        ></textarea>
        <button class="send-btn" @click="sendReport" :disabled="!reportText.trim()">
          Enviar
        </button>
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref } from 'vue';
import LayoutApp from '../LayoutApp.vue';

// Variables reactivas para el estado de la grabación y el texto del reporte
const isRecording = ref(false);
const reportText = ref('');

// Función para iniciar/detener la grabación
const toggleRecording = () => {
  isRecording.value = !isRecording.value;
  console.log('Grabación ' + (isRecording.value ? 'iniciada' : 'detenida'));
  // Lógica para iniciar la grabación con el micrófono aquí
};

// Función para enviar el reporte
const sendReport = () => {
  console.log('Reporte enviado:', reportText.value);
  // Lógica para enviar el texto a Dialogflow u otro servicio
  reportText.value = ''; // Limpia el campo de texto después de enviar
};
</script>

<style scoped>
.report-section {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  font-family: 'Arial', sans-serif;
}

h2 {
  color: #388e3c;
  text-align: center;
  margin-bottom: 1.5rem;
}

.input-options {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mic-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #4caf50;
  background-color: #f0fff0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  font-size: 1.5rem;
  line-height: 1;
}

.mic-btn:hover {
  background-color: #e6ffe6;
}

.mic-btn.recording {
  background-color: #e53935;
  border-color: #e53935;
  animation: pulse-red 1.5s infinite;
}

.mic-btn.recording span {
  color: #fff;
}

.recording-text {
  color: #e53935;
  font-weight: bold;
}

.report-textarea {
  flex-grow: 1;
  padding: 0.8rem;
  border: 1px solid #b6e2c7;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 100px;
}

.report-textarea:focus {
  border-color: #43a047;
  outline: none;
  box-shadow: 0 0 5px rgba(67, 160, 71, 0.5);
}

.send-btn {
  padding: 0.8rem 1.2rem;
  background-color: #43a047;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.send-btn:hover:not(:disabled) {
  background-color: #388e3c;
}

.send-btn:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

@keyframes pulse-red {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@media (max-width: 600px) {
  .input-options {
    flex-direction: column;
    align-items: stretch;
  }

  .mic-btn {
    align-self: flex-start;
  }
}
</style>
