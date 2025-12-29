<template>
  <div class="rfid-banner rounded-3 shadow-sm px-3 py-2" :class="connectionClass">
    <div class="d-flex align-items-center justify-content-between">

      <!-- Estado conexión -->
      <span class="fw-bold d-flex align-items-center status-text">
        <i :class="connectionIcon" class="me-2"></i> 
        <span class="d-none d-sm-inline">{{ connectionStatus }}</span>
      </span>

      <div class="d-flex align-items-center gap-3">

        <!-- CHIP -->
        <div v-if="sessionPropertyStore.onScanned" class="chip-info text-white px-2 py-1 rounded">
          <small class="opacity-75">Chip</small>
          <strong class="text-warning ms-1">{{ sessionPropertyStore.chipSerie }}</strong>
        </div>

        <!-- 🐄 BOVINO -->
        <div v-if="bovine" class="bovine-info px-3 py-2 rounded shadow-sm">
          <div class="fw-bold text-success">
            🐄 {{ bovine.rgd }}
          </div>
          <div class="small text-muted">
            {{ bovine.sex === 'female' ? 'Hembra' : 'Macho' }} • {{ bovine.weight }} kg
          </div>
          <div class="small text-muted">
            Nac: {{ bovine.birthdate }}
          </div>
        </div>

        <!-- BOTÓN -->
        <button
          @click="connectReader"
          :disabled="connectionState !== 'disconnected' || isConnecting"
          class="btn btn-sm btn-action text-white fw-bold border-1 border-white"
          :class="buttonClass"
        >
          <span v-if="connectionState === 'disconnected'">
            <i class="fas fa-plug me-1"></i> Conectar
          </span>
          <span v-else-if="connectionState === 'connecting'">
            <span class="spinner-border spinner-border-sm me-1"></span>
          </span>
          <span v-else>
            <i class="fas fa-check-circle me-1"></i> En Línea
          </span>
        </button>

      </div>
    </div>
  </div>
</template>


<script setup>
import { useSerialReader } from '@/composables/useSerialReader';

const {
  connectionState,
  connectionStatus,
  connectionClass,
  connectionIcon,
  buttonClass,
  isConnecting,
  connectReader,
  sessionPropertyStore
} = useSerialReader();
</script>

<style scoped>
/* Evitamos que el componente crezca de más */
.rfid-banner {
  min-height: 50px;
  max-height: 60px; /* Limitamos el alto para que no empuje el resto del layout */
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.status-text {
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.chip-info {
  background: rgba(0, 0, 0, 0.2);
  font-size: 0.85rem;
  border: 1px dashed rgba(255, 255, 255, 0.3);
}

.btn-action {
  transition: transform 0.2s active;
  font-size: 0.8rem;
  text-transform: uppercase;
}

.btn-action:active {
  transform: scale(0.95);
}

/* Ajustes de colores para que coincidan con tus clases dinámicas si no están en el CSS global */
:deep(.text-bg-danger) { background-color: #dc3545 !important; color: white !important; }
:deep(.text-bg-success) { background-color: #198754 !important; color: white !important; }
:deep(.text-bg-warning) { background-color: #ffc107 !important; color: #212529 !important; }
</style>