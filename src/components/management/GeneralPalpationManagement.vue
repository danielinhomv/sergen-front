<template>
  <div class="palpation-container">

    <div v-if="!sessionPropertyStore.onScanned" class="loading-state-premium">
      <div class="spinner-border text-success-premium mb-3" role="status"></div>
      <p class="loading-text-premium">{{ loadingText }}</p>
    </div>

    <div v-else class="content-wrapper animate__animated animate__fadeIn">

      <div v-if="!item && !showForm" class="empty-state-container">
        <div class="empty-icon-box">
          <i class="fas fa-hand-holding-medical"></i>
        </div>
        <h4 class="fw-bold text-dark">Sin registros de Palpación</h4>
        <p class="text-muted mb-4">Aún no se ha realizado el diagnóstico clínico para este ciclo.</p>
        <button class="btn btn-success-premium shadow-sm px-5" @click="openAddForm">
          <i class="fas fa-plus-circle me-2"></i>REGISTRAR PALPACIÓN
        </button>
      </div>

      <div v-if="item && !showForm" class="detail-card-premium shadow-sm">
        <div class="card-premium-header">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-badge-premium highlight">
                <i class="fas fa-stethoscope"></i>
              </div>
              <div>
                <span :class="['status-pill-base mb-1 d-inline-block', statusBadgeClass(item.status)]">
                  {{ statusLabel(item.status) }}
                </span>
                <h5 class="fw-bold text-dark m-0">Diagnóstico de Palpación</h5>
              </div>
            </div>
            <button class="btn-edit-round" @click="openEditForm">
              <i class="fas fa-pen"></i>
            </button>
          </div>
        </div>

        <div class="card-premium-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="label-premium">FECHA DEL EXAMEN</label>
              <p class="value-premium"><i class="fas fa-calendar-alt me-2 text-success"></i>{{ item.date }}</p>
            </div>

            <div class="col-12" v-if="item.observation">
              <div class="premium-divider"></div>
              <label class="label-premium">OBSERVACIONES CLÍNICAS</label>
              <div class="text-box-premium">
                <i class="fas fa-comment-medical me-2 text-success"></i>
                {{ item.observation }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="form-premium-card animate__animated animate__fadeInUp">
        <div class="form-header-premium mb-4">
          <h5 class="text-dark fw-bold m-0">
            <i class="fas fa-file-medical text-success me-2"></i>
            {{ editing ? 'Editar Diagnóstico' : 'Nuevo Diagnóstico de Palpación' }}
          </h5>
          <p class="text-muted small">Ingrese los resultados del tacto rectal</p>
        </div>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="label-premium">ESTADO REPRODUCTIVO *</label>
              <select v-model="form.status" class="form-control-premium" :class="{ 'is-invalid': errors.status }">
                <option value="">Seleccione...</option>
                <option value="pregnant">Preñada</option>
                <option value="empty">Vacía</option>
                <option value="discard">Descartada</option>
                <option value="abort">Abortada</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="label-premium">FECHA DE EVALUACIÓN *</label>
              <input type="date" v-model="form.date" class="form-control-premium"
                :class="{ 'is-invalid': errors.date }" />
            </div>

            <div class="col-12">
              <label class="label-premium">OBSERVACIÓN (OPCIONAL)</label>
              <textarea v-model="form.observation" class="form-control-premium" rows="3"
                placeholder="Detalles sobre ovarios, útero o hallazgos específicos..."></textarea>
            </div>
          </div>

          <div class="d-flex gap-3 mt-5">
            <button class="btn btn-success-premium px-5" type="submit" :disabled="!isFormValid || isSaving">
              {{ isSaving ? 'GUARDANDO...' : (editing ? 'ACTUALIZAR DIAGNÓSTICO' : 'GUARDAR PALPACIÓN') }}
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
import { GeneralPalpationService } from '@/services/management/GeneralPalpationService'
import { GeneralPalpation } from '@/model/management/GeneralPalpation'
import { useSessionPropertyStore } from '@/store/SessionProperty'

const service = new GeneralPalpationService()
const sessionPropertyStore = useSessionPropertyStore()

const item = ref(null)
const isSaving = ref(false)
const loadingText = ref('Sincronizando...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  status: '',
  observation: '',
  date: new Date().toISOString().split('T')[0]
})

const errors = ref({ status: false, date: false })

/* =========================
   UI HELPERS (TOAST)
========================= */
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

const isFormValid = computed(() => !!form.value.status && !!form.value.date)

async function loadItem() {
  loadingText.value = 'Cargando datos de palpación...'
  try {
    const response = await service.get(sessionPropertyStore.getControlBovineId)
    item.value = response || null
    console.log('Datos de palpación cargados:', item.value)
  } catch (error) {
    showToast('Error al cargar los datos.', 'danger')
  }
}

function openAddForm() {
  editing.value = false
  form.value = { id: null, status: '', observation: '', date: new Date().toISOString().split('T')[0] }
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
    // Instanciación del modelo según GeneralPalpation.ts
    const palpationData = new GeneralPalpation({
      ...form.value,
      controlBovineId: sessionPropertyStore.getControlBovineId // camelCase con c minúscula
    })

    if (editing.value) {
      await service.update(form.value.id, palpationData)
      showToast('¡Diagnóstico actualizado correctamente!')
    } else {
      await service.create(palpationData)
      showToast('¡Palpación registrada con éxito!')
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
  const labels = { 'pregnant': 'Preñada', 'empty': 'Vacía', 'discard': 'Descartada', 'abort': 'Abortada' }
  return labels[value] || value
}

function statusBadgeClass(value) {
  const classes = {
    'pregnant': 'bg-success-soft text-success',
    'empty': 'bg-danger-soft text-danger',
    'discard': 'bg-info-soft text-info',
    'abort': 'bg-warning-soft text-warning'
  }
  return classes[value] || 'bg-light text-muted'
}

onMounted(() => {
  if (sessionPropertyStore.onScanned) {
    loadItem()
  }
})
</script>

<style scoped>
/* Los estilos se mantienen íntegros para el diseño premium */
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
  padding: 4rem;
  background: white;
  border-radius: 24px;
  border: 2px dashed #e2e8f0;
}

.empty-icon-box {
  width: 80px;
  height: 80px;
  background: #f0fdf4;
  color: #16a34a;
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

.bg-danger-soft {
  background-color: #fee2e2 !important;
}

.bg-info-soft {
  background-color: #e0f2fe !important;
}

.bg-warning-soft {
  background-color: #fef3c7 !important;
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
  font-size: 1.1rem;
  margin: 0;
}

.text-box-premium {
  padding: 16px;
  background: #f8fafc;
  border-radius: 14px;
  color: #475569;
  border: 1px solid #f1f5f9;
}

.premium-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 20px 0;
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