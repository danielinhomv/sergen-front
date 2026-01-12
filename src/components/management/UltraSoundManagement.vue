<template>
  <div class="ultrasound-container">

    <div v-if="!sessionPropertyStore.onScanned" class="loading-state-premium">
      <div class="spinner-border text-success-premium mb-3" role="status"></div>
      <p class="loading-text-premium">{{ loadingText }}</p>
    </div>

    <div v-else class="content-wrapper animate__animated animate__fadeIn">

      <div v-if="!item && !showForm" class="empty-state-container">
        <div class="empty-icon-box">
          <i class="fas fa-stethoscope"></i>
        </div>
        <h4 class="fw-bold text-dark">Sin Ecografía</h4>
        <p class="text-muted mb-4">Aún no se ha realizado el diagnóstico para este animal.</p>
        <button class="btn btn-success-premium shadow-sm px-5" @click="openAddForm">
          <i class="fas fa-plus-circle me-2"></i>REGISTRAR ECOGRAFÍA
        </button>
      </div>

      <div v-if="item && !showForm" class="detail-card-premium shadow-sm">
        <div class="card-premium-header">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-badge-premium highlight">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div>
                <span :class="[statusBadgeClass(item.status), 'status-pill-base mb-1 d-inline-block']">
                  {{ statusLabel(item.status) }}
                </span>
                <h5 class="fw-bold text-dark m-0">Resultado de Diagnóstico</h5>
              </div>
            </div>
            <button class="btn-edit-round" @click="openEditForm">
              <i class="fas fa-pen"></i>
            </button>
          </div>
        </div>

        <div class="card-premium-body">
          <div class="row g-4">
            <div class="col-md-4">
              <label class="label-premium">FECHA DE CONTROL</label>
              <p class="value-premium"><i class="fas fa-calendar-alt me-2 text-success"></i>{{ item.date }}</p>
            </div>
            <div class="col-md-4">
              <label class="label-premium">VITAMINAS Y MINERALES</label>
              <p class="value-premium">
                <i :class="item.vitaminsAndMinerals ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger'"
                  class="me-2"></i>
                {{ item.vitaminsAndMinerals ? 'Aplicado' : 'No aplicado' }}
              </p>
            </div>
            <div class="col-md-4" v-if="item.workTeam">
              <label class="label-premium">EQUIPO DE TRABAJO</label>
              <p class="value-premium"><i class="fas fa-users me-2 text-success"></i>{{ item.workTeam }}</p>
            </div>

            <div class="col-12">
              <div class="premium-divider"></div>
            </div>

            <div class="col-md-6" v-if="item.protocolDetails">
              <label class="label-premium">DETALLES DEL PROTOCOLO</label>
              <div class="text-box-premium">{{ item.protocolDetails }}</div>
            </div>
            <div class="col-md-6" v-if="item.usedProductsSummary">
              <label class="label-premium">PRODUCTOS USADOS</label>
              <div class="text-box-premium highlight">{{ item.usedProductsSummary }}</div>
            </div>
            <div class="col-12" v-if="item.refugo">
              <label class="label-premium">REFUGO</label>
              <div class="text-box-premium">{{ item.refugo }}</div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="form-premium-card animate__animated animate__fadeInUp">
        <div class="form-header-premium mb-4">
          <h5 class="text-dark fw-bold m-0">
            <i class="fas fa-edit text-success me-2"></i>
            {{ editing ? 'Editar Ecografía' : 'Nueva Ecografía' }}
          </h5>
          <p class="text-muted small">Complete la información del diagnóstico</p>
        </div>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="label-premium">ESTADO DEL ANIMAL *</label>
              <select v-model="form.status" class="form-control-premium" :class="{ 'is-invalid': errors.status }">
                <option value="">Seleccione el estado...</option>
                <option value="pregnant">Preñada</option>
                <option value="implanted">Implantada</option>
                <option value="discarded">Descartada</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="label-premium">FECHA *</label>
              <input type="date" v-model="form.date" class="form-control-premium"
                :class="{ 'is-invalid': errors.date }" />
            </div>

            <div class="col-12 py-2">
              <div class="form-check form-switch custom-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="vitaminsSwitch"
                  v-model="form.vitaminsAndMinerals">
                <label class="form-check-label fw-bold text-dark" for="vitaminsSwitch">
                  ¿Se aplicaron Vitaminas y Minerales?
                </label>
              </div>
            </div>

            <div class="col-md-6">
              <label class="label-premium">DETALLES DEL PROTOCOLO</label>
              <textarea v-model="form.protocolDetails" class="form-control-premium" rows="3"
                placeholder="Describa el protocolo..."></textarea>
            </div>

            <div class="col-md-6">
              <label class="label-premium">PRODUCTOS USADOS *</label>
              <textarea v-model="form.usedProductsSummary" class="form-control-premium" rows="3"
                placeholder="Productos utilizados..."></textarea>
            </div>

            <div class="col-md-6">
              <label class="label-premium">REFUGO</label>
              <textarea v-model="form.refugo" class="form-control-premium" rows="2"
                placeholder="Resumen clínico de la ecografía"></textarea>
            </div>

            <div class="col-md-6">
              <label class="label-premium">EQUIPO DE TRABAJO *</label>
              <input v-model="form.workTeam" class="form-control-premium" placeholder="Personal encargado..." />
            </div>
          </div>

          <div class="d-flex gap-3 mt-5">
            <button class="btn btn-success-premium px-5" type="submit" :disabled="!isFormValid || isSaving">
              {{ isSaving ? 'GUARDANDO...' : (editing ? 'ACTUALIZAR REGISTRO' : 'GUARDAR REGISTRO') }}
            </button>
            <button class="btn btn-light-premium px-4" type="button" @click="cancelForm">
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080">
      <div id="liveToast" class="toast align-items-center border-0 shadow-lg text-white" role="alert"
        aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div id="toast-message" class="toast-body flex-grow-1 p-3 fw-bold"></div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Toast } from 'bootstrap'
import { UltrasoundService } from '@/services/management/UltrasoundService'
import { Ultrasound } from '@/model/management/Ultrasound'
import { useSessionPropertyStore } from '@/store/SessionProperty'

const service = new UltrasoundService()
const sessionPropertyStore = useSessionPropertyStore()

const item = ref(null)
const isSaving = ref(false)
const loadingText = ref('Sincronizando...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  vitaminsAndMinerals: false,
  status: '',
  protocolDetails: '',
  usedProductsSummary: '', // Coincide con el constructor
  workTeam: '',
  refugo: '',
  date: new Date().toISOString().split('T')[0]
})

const errors = ref({ status: false, date: false })

function showToast(message, type = 'success') {
  const toastEl = document.getElementById('liveToast');
  if (toastEl) {
    toastEl.className = `toast align-items-center border-0 shadow-lg text-white bg-${type === 'success' ? 'success' : 'danger'}`;
    const msgEl = document.getElementById('toast-message');
    if (msgEl) msgEl.textContent = message;
    new Toast(toastEl).show();
  }
}

watch(() => form.value, () => {
  errors.value.status = !form.value.status
  errors.value.date = !form.value.date
}, { deep: true })

const isFormValid = computed(() =>
  !!form.value.status &&
  !!form.value.date &&
  !!form.value.usedProductsSummary &&
  !!form.value.workTeam
)

async function loadItem() {
  loadingText.value = 'Cargando datos de ecografía...'
  try {
    const response = await service.get(sessionPropertyStore.getControlBovineId)
    item.value = response || null
  } catch (error) {
    showToast('Error al cargar los datos.', 'danger')
  }
}

function openAddForm() {
  editing.value = false
  form.value = {
    id: null, vitaminsAndMinerals: false, status: '',
    protocolDetails: '', usedProductsSummary: '', workTeam: '',
    date: new Date().toISOString().split('T')[0], refugo: ''
  }
  showForm.value = true
}

function openEditForm() {
  editing.value = true
  form.value = { ...item.value }
  showForm.value = true
}

function cancelForm() { showForm.value = false }

async function submitForm() {
  if (!isFormValid.value) return
  isSaving.value = true
  try {
    // Instanciación exacta según el constructor de Ultrasound.ts
    const ultrasoundData = new Ultrasound({
      ...form.value,
      controlBovineId: sessionPropertyStore.getControlBovineId // camelCase con c minúscula
    })

    if (editing.value) {
      await service.update(form.value.id, ultrasoundData)
      showToast('Registro actualizado correctamente.')
    } else {
      await service.create(ultrasoundData)
      showToast('Ecografía registrada con éxito.')
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    showToast('Error al procesar la solicitud.', 'danger')
  } finally {
    isSaving.value = false
  }
}

function statusLabel(value) {
  const map = { pregnant: 'Preñada', implanted: 'Implantada', discarded: 'Descartada' }
  return map[value] || value
}

function statusBadgeClass(value) {
  const map = {
    pregnant: 'bg-success-soft text-success',
    implanted: 'bg-info-soft text-info',
    discarded: 'bg-danger-soft text-danger'
  }
  return map[value] || 'bg-secondary-soft text-secondary'
}

onMounted(() => {
  if (sessionPropertyStore.onScanned) {
    loadItem()
  }
});
</script>

<style scoped>
/* Los estilos se mantienen íntegros */
.loading-state-premium {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;
}

.text-success-premium {
  color: #2d4a22 !important;
}

.loading-text-premium {
  color: #475569;
  font-weight: 700;
  font-size: 1.1rem;
  animation: fadePulse 1.5s infinite;
}

@keyframes fadePulse {
  0% {
    opacity: 0.6;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.6;
  }
}

.empty-state-container {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 24px;
  border: 2px dashed #e2e8f0;
}

.empty-icon-box {
  width: 80px;
  height: 80px;
  background: #f0fdf4;
  color: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 20px;
}

.detail-card-premium {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #edf2f7;
}

.card-premium-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  background: #fcfdfc;
}

.card-premium-body {
  padding: 2rem;
}

.icon-badge-premium {
  width: 50px;
  height: 50px;
  background: #2d4a22;
  color: #c0da63;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.icon-badge-premium.highlight {
  background: #16a34a;
  color: white;
}

.status-pill-base {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
}

.bg-success-soft {
  background-color: #dcfce7 !important;
}

.bg-info-soft {
  background-color: #e0f2fe !important;
}

.bg-danger-soft {
  background-color: #fee2e2 !important;
}

.label-premium {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  margin-bottom: 8px;
  display: block;
}

.value-premium {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
  margin: 0;
}

.text-box-premium {
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  color: #475569;
  border: 1px solid #f1f5f9;
}

.text-box-premium.highlight {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.premium-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 10px 0;
}

.form-premium-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
}

.form-control-premium {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #f1f5f9;
  border-radius: 14px;
  font-weight: 600;
  color: #1e293b;
}

.btn-success-premium {
  background: #2d4a22;
  color: #c0da63;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
}

.btn-light-premium {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
}

.btn-edit-round {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
}
</style>