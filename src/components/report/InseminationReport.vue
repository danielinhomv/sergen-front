<template>
  <div class="report-section">
    <div class="input-options">
      <button class="mic-btn" :class="{ recording: isRecording }" @click="toggleRecording"
        :aria-label="isRecording ? 'Detener grabación' : 'Iniciar grabación'">
        <span v-if="!isRecording">🎤</span>
        <span v-else>⏹️</span>
      </button>
      <span v-if="isRecording" class="recording-text">Grabando...</span>

      <textarea v-model="reportText" placeholder="Escribe aquí tu reporte o usa el micrófono" rows="3"
        class="report-textarea"></textarea>

      <div class="action-buttons">
        <button class="send-btn" @click="sendReport" :disabled="!reportText.trim()">
          Enviar
        </button>

        <button class="clean-btn" @click="clearText" :disabled="!reportText.trim()" aria-label="Limpiar">
          🧹 Limpiar
        </button>
      </div>
    </div>

    <!-- Mostrar resultados del reporte -->
    <div v-if="reportData.length > 0" class="results mt-4">
      <h3 class="text-success">Resultados del Reporte</h3>
      <div class="table-responsive">
        <table class="table table-striped table-hover">
          <thead class="table-success">
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Toro</th>
              <th>Condición Corporal</th>
              <th>Calidad de Celo</th>
              <th>Observación</th>
              <th>Otros</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in reportData" :key="item.id">
              <td>{{ item.id }}</td>
              <td>{{ formatDate(item.date) }}</td>
              <td>{{ item.bull || 'N/A' }}</td>
              <td>{{ item.bodyConditionScore }}</td>
              <td>{{ item.heatQuality }}</td>
              <td>{{ item.observation || '-' }}</td>
              <td>{{ item.others || '-' }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Mensaje cuando no hay datos -->
    <div v-else-if="hasSearched && reportData.length === 0" class="alert alert-info mt-4">
      No se encontraron resultados para la búsqueda realizada.
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="text-center mt-4">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { InseminationReportService } from '@/services/report/InseminationReportService';
import { useSessionPropertyStore } from '@/store/SessionProperty';
import { defineProps } from 'vue';

// Props recibidas del componente padre 
const props = defineProps({
  fechaInicio: String,
  fechaFin: String
});

// Store y servicio
const sessionPropertyStore = useSessionPropertyStore();
const inseminationReportService = new InseminationReportService();

// Variables reactivas
const isRecording = ref(false);
const reportText = ref('');
const reportData = ref([]);
const isLoading = ref(false);
const hasSearched = ref(false);

// =======================
// LÓGICA DEL MICRÓFONO
// =======================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
  recognition = new SpeechRecognition();
  recognition.lang = "es-ES";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onresult = (event) => {
    let finalText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      finalText += event.results[i][0].transcript;
    }
    reportText.value = finalText.trim();
  };

  recognition.onerror = (event) => {
    console.error("Error en reconocimiento de voz:", event.error);
    isRecording.value = false;
  };

  recognition.onend = () => {
    if (isRecording.value) recognition.start();
  };
}

// Iniciar o detener grabación
const toggleRecording = () => {
  if (!SpeechRecognition) {
    alert("El reconocimiento de voz no es compatible con este navegador.");
    return;
  }

  isRecording.value = !isRecording.value;

  if (isRecording.value) {
    recognition.start();
    console.log("🎤 Grabando...");
  } else {
    recognition.stop();
    console.log("🛑 Grabación detenida.");
  }
};

// Limpiar texto
const clearText = () => {
  reportText.value = '';
};

// =======================
// FUNCIÓN PARA ENVIAR REPORTE
// =======================
const sendReport = async () => {
  if (!reportText.value.trim()) return;

  isLoading.value = true;
  hasSearched.value = false;

  try {
    const request = {
      text: reportText.value.trim(),
      property_id: sessionPropertyStore.getPropertyId,
      start_date: props.fechaInicio ? `${props.fechaInicio}T00:00:00` : null,
      end_date: props.fechaFin ? `${props.fechaFin}T23:59:59` : null,
      user_id: 2 // Fijo
    };

    const result = await inseminationReportService.getInseminationReport(request);
    reportData.value = result;
    hasSearched.value = true;
    reportText.value = '';
    isRecording.value = false;
    recognition.stop();

  } catch (error) {
    console.error('Error al obtener el reporte:', error);
    alert(`Error al generar el reporte: ${error.message}`);
  } finally {
    isLoading.value = false;
  }
};

// Formatear fechas
const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};
</script>


<style scoped>
.report-section {
  padding: 20px;
}

.input-options {
  display: flex;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.mic-btn {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid #28a745;
  background-color: white;
  cursor: pointer;
  font-size: 24px;
  transition: all 0.3s;
  flex-shrink: 0;
}

.mic-btn:hover {
  background-color: #f8f9fa;
}

.mic-btn.recording {
  background-color: #dc3545;
  border-color: #dc3545;
  animation: pulse 1s infinite;
}

@keyframes pulse {

  0%,
  100% {
    transform: scale(1);
    opacity: 1;
  }

  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.recording-text {
  color: #dc3545;
  font-weight: bold;
  animation: blink 1.5s infinite;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }
}

.report-textarea {
  flex: 1;
  padding: 12px;
  border: 2px solid #28a745;
  border-radius: 8px;
  resize: vertical;
  font-family: inherit;
  font-size: 14px;
}

.report-textarea:focus {
  outline: none;
  border-color: #1e7e34;
  box-shadow: 0 0 0 0.2rem rgba(40, 167, 69, 0.25);
}

.send-btn {
  padding: 12px 30px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.3s;
  flex-shrink: 0;
}

.send-btn:hover:not(:disabled) {
  background-color: #218838;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.send-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
  opacity: 0.6;
}

.results {
  animation: fadeIn 0.5s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.table-responsive {
  margin-top: 15px;
}

.table {
  background-color: white;
}

.table th {
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.table td {
  vertical-align: middle;
}

.alert {
  border-radius: 8px;
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.clean-btn {
  background-color: #ffffff;            /* blanco como tus inputs */
  border: 2px solid #32a354;            /* verde como tu paleta */
  color: #32a354;                       /* texto verde */
  padding: 10px 14px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s all ease;
  display: flex;
  align-items: center;
  gap: 6px;                             /* espacio ícono-texto */
}

/* Hover */
.clean-btn:hover:not(:disabled) {
  background-color: #32a354;
  color: white;                         /* se invierten colores */
}

/* Disabled */
.clean-btn:disabled {
  background-color: #e0e0e0 !important; /* mismo gris que Enviar deshabilitado */
  border-color: #e0e0e0 !important;
  color: white !important;            /* texto gris */
  cursor: not-allowed;
}

</style>