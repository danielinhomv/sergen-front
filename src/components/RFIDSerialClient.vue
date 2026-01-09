<template>
  <div class="rfid-banner-premium shadow-sm px-4" :class="connectionClass">
    <div class="d-flex align-items-center justify-content-between h-100">

      <div class="d-flex align-items-center gap-3">
        <div class="status-indicator">
          <i :class="[connectionIcon, 'status-icon', connectionState]"></i>
          <span class="pulse-ring" v-if="connectionState === 'connected'"></span>
        </div>
        <div class="d-flex flex-column">
          <span class="status-label">Lector RFID</span>
          <span class="status-text fw-bold">{{ connectionStatus }}</span>
        </div>
      </div>

      <div class="d-flex align-items-center gap-3 flex-grow-1 justify-content-center">

        <div v-if="sessionPropertyStore.onScanned" class="glass-badge animate__animated animate__fadeInLeft">
          <i class="fas fa-microchip me-2 text-warning"></i>
          <span class="label">ID:</span>
          <strong class="value">{{ sessionPropertyStore.chipSerie }}</strong>
        </div>

        <div v-if="bovine" class="bovine-mini-card animate__animated animate__fadeInUp">
          <div class="bovine-icon">🐄</div>
          <div class="bovine-details">
            <div class="bovine-rgd">{{ bovine.rgd }}</div>
            <div class="bovine-meta">
              {{ bovine.sex === 'female' ? 'Hembra' : 'Macho' }} • {{ bovine.weight }}kg
            </div>
          </div>
        </div>
      </div>

      <div class="d-flex align-items-center">
        <button @click="connectReader" :disabled="connectionState !== 'disconnected' || isConnecting"
          class="btn-premium-action" :class="buttonClass">
          <template v-if="connectionState === 'disconnected'">
            <i class="fas fa-plug me-2"></i> CONECTAR
          </template>
          <template v-else-if="connectionState === 'connecting'">
            <span class="spinner-border spinner-border-sm me-2"></span> PROCESANDO
          </template>
          <template v-else>
            <i class="fas fa-check-double me-2"></i> DISPOSITIVO ACTIVO
          </template>
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
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

// EXTRAEMOS EL BOVINO DIRECTAMENTE DEL STORE PARA QUE SEA REACTIVO
const bovine = computed(() => sessionPropertyStore.bovine);
</script>

<style scoped>
/* CONTENEDOR PRINCIPAL PREMIUM */
.rfid-banner-premium {
  height: 75px;
  border-radius: 16px;
  background: white;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  margin-bottom: 1.5rem;
}

/* VARIANTES DE ESTADO */
.bg-danger {
  border-left: 5px solid #ef4444;
  background: linear-gradient(90deg, #fff5f5, #ffffff);
}

.bg-success {
  border-left: 5px solid #10b981;
  background: linear-gradient(90deg, #f0fdf4, #ffffff);
}

.bg-info {
  border-left: 5px solid #3b82f6;
  background: linear-gradient(90deg, #eff6ff, #ffffff);
}

/* ICONOS Y PULSO */
.status-indicator {
  position: relative;
  display: flex;
  align-items: center;
}

.status-icon {
  font-size: 1.4rem;
  z-index: 2;
}

.status-icon.connected {
  color: #10b981;
}

.status-icon.disconnected {
  color: #ef4444;
}

.pulse-ring {
  position: absolute;
  width: 30px;
  height: 30px;
  background: rgba(16, 185, 129, 0.2);
  border-radius: 50%;
  animation: pulse-ring 2s infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(0.5);
    opacity: 0;
  }

  50% {
    opacity: 1;
  }

  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.status-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 1px;
}

.status-text {
  font-size: 0.85rem;
  color: #1e293b;
  white-space: nowrap;
}

/* BADGE DEL CHIP (GLASS) */
.glass-badge {
  background: rgba(15, 23, 42, 0.05);
  padding: 8px 15px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
}

.glass-badge .label {
  font-size: 0.7rem;
  color: #64748b;
  margin-right: 5px;
}

.glass-badge .value {
  font-size: 0.9rem;
  color: #1e293b;
  font-family: 'Courier New', Courier, monospace;
}

/* CARD BOVINO MINI */
.bovine-mini-card {
  display: flex;
  align-items: center;
  background: white;
  padding: 6px 14px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border: 1px solid #e2e8f0;
}

.bovine-icon {
  font-size: 1.4rem;
  margin-right: 10px;
}

.bovine-rgd {
  font-weight: 800;
  color: #2d4a22;
  font-size: 0.85rem;
  line-height: 1;
}

.bovine-meta {
  font-size: 0.65rem;
  color: #64748b;
  font-weight: 600;
}

/* BOTÓN PREMIUM */
.btn-premium-action {
  border: none;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 800;
  transition: 0.3s;
  letter-spacing: 0.5px;
}

.btn-success {
  background: #10b981;
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.btn-primary {
  background: #2d4a22;
  color: white;
  box-shadow: 0 4px 12px rgba(45, 74, 34, 0.2);
}

.btn-info {
  background: #3b82f6;
  color: white;
}

.btn-premium-action:hover:not(:disabled) {
  transform: translateY(-2px);
  filter: brightness(1.1);
}

.btn-premium-action:disabled {
  opacity: 0.8;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .rfid-banner-premium {
    height: auto;
    padding: 15px;
  }

  .h-100 {
    flex-direction: column;
    gap: 15px;
  }

  .bovine-mini-card {
    width: 100%;
  }
}
</style>