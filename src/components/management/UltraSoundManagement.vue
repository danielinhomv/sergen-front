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
              <div class="icon-badge-premium">
                <i class="fas fa-microscope"></i>
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
                <i :class="item.vitamins_and_minerals ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger'"
                  class="me-2"></i>
                {{ item.vitamins_and_minerals ? 'Aplicado' : 'No aplicado' }}
              </p>
            </div>
            <div class="col-md-4" v-if="item.work_team">
              <label class="label-premium">EQUIPO DE TRABAJO</label>
              <p class="value-premium"><i class="fas fa-users me-2 text-success"></i>{{ item.work_team }}</p>
            </div>

            <div class="col-12">
              <div class="premium-divider"></div>
            </div>

            <div class="col-md-6" v-if="item.protocol_details">
              <label class="label-premium">DETALLES DEL PROTOCOLO</label>
              <div class="text-box-premium">{{ item.protocol_details }}</div>
            </div>
            <div class="col-md-6" v-if="item.used_products_summary">
              <label class="label-premium">PRODUCTOS USADOS</label>
              <div class="text-box-premium highlight">{{ item.used_products_summary }}</div>
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
                  v-model="form.vitamins_and_minerals">
                <label class="form-check-label fw-bold text-dark" for="vitaminsSwitch">
                  ¿Se aplicaron Vitaminas y Minerales?
                </label>
              </div>
            </div>

            <div class="col-md-6">
              <label class="label-premium">DETALLES DEL PROTOCOLO</label>
              <textarea v-model="form.protocol_details" class="form-control-premium" rows="3"
                placeholder="Describa el protocolo..."></textarea>
            </div>

            <div class="col-md-6">
              <label class="label-premium">RESUMEN DE PRODUCTOS USADOS</label>
              <textarea v-model="form.used_products_summary" class="form-control-premium" rows="3"
                placeholder="Productos utilizados..."></textarea>
            </div>

            <div class="col-md-6">
              <label class="label-premium">REFUGO</label>
              <textarea v-model="form.refugo" class="form-control-premium" rows="2"
                placeholder="Resumen clínico de la ecografía"></textarea>
            </div>


            <div class="col-md-6">
              <label class="label-premium">EQUIPO DE TRABAJO</label>
              <input v-model="form.work_team" class="form-control-premium" placeholder="Personal encargado..." />
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Toast } from 'bootstrap'
import { UltrasoundService } from '@/services/management/UltrasoundService'
import { useSessionPropertyStore } from '@/store/SessionProperty'

const service = new UltrasoundService()
const sessionPropertyStore = useSessionPropertyStore()

const item = ref(null)
const isSaving = ref(false)
const loadingText = ref('Escanee un bovino para cargar los datos...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  vitamins_and_minerals: false,
  status: '',
  protocol_details: '',
  used_products_summary: '',
  work_team: '',
  refugo: '',
  date: new Date().toISOString().split('T')[0]
})

const errors = ref({ status: false, date: false })

watch(() => form.value, () => {
  errors.value.status = !form.value.status
  errors.value.date = !form.value.date
}, { deep: true })

const isFormValid = computed(() => !!form.value.status && !!form.value.date && !!form.value.used_products_summary && !!form.value.work_team)

function showToast(type, message) {
  const toastEl = document.getElementById('liveToast');
  if (!toastEl) return;
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  toastEl.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning');

  if (type === 'success') {
    toastEl.classList.add('text-bg-success');
    toastIcon.innerHTML = '<i class="fas fa-check-circle fs-5"></i>';
  } else if (type === 'error') {
    toastEl.classList.add('text-bg-danger');
    toastIcon.innerHTML = '<i class="fas fa-times-circle fs-5"></i>';
  }

  toastMessage.textContent = message;
  const toast = Toast.getInstance(toastEl) || new Toast(toastEl, { delay: 4000 });
  toast.show();
}

async function loadItem() {
  loadingText.value = 'Cargando datos de ecografía...'
  try {
    const response = await service.get(sessionPropertyStore.controlBovineId)
    item.value = response || null
  } catch (error) {
    showToast('error', error.message || 'Error al cargar los datos de ecografía')
  }
}

function openAddForm() {
  editing.value = false
  form.value = {
    id: null, vitamins_and_minerals: false, status: '',
    protocol_details: '', used_products_summary: '', work_team: '',
    date: new Date().toISOString().split('T')[0], refugo: ''
  }
  showForm.value = true
}

function openEditForm() {
  editing.value = true
  form.value = { ...item.value }
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
}

async function submitForm() {
  if (!isFormValid.value) return
  isSaving.value = true
  try {
    if (editing.value) {
      await service.update(form.value.id, form.value)
      showToast('success', 'Registro actualizado.')
    } else {
      await service.create(form.value)
      showToast('success', 'Ecografía registrada con éxito.')
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    showToast('error', 'Error al procesar la solicitud.')
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
/* --- ESTRUCTURA --- */
.ultrasound-container {
  width: 100%;
}

/* --- ESTRUCTURA DE CARGA (VISIBILIDAD CORREGIDA) --- */
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

.spinner-border {
  width: 3rem;
  height: 3rem;
}

.loading-text-premium {
  color: #475569;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
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

/* --- EMPTY STATE --- */
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

/* --- CARD DETALLE --- */
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

/* --- BADGES DINÁMICOS (Adaptados a statusBadgeClass) --- */
.status-pill-base {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Clases generadas por statusBadgeClass con toque Premium */
.bg-success-soft {
  background-color: #dcfce7 !important;
}

.text-success {
  color: #15803d !important;
}

.bg-info-soft {
  background-color: #e0f2fe !important;
}

.text-info {
  color: #0369a1 !important;
}

.bg-danger-soft {
  background-color: #fee2e2 !important;
}

.text-danger {
  color: #b91c1c !important;
}

/* --- ELEMENTOS DE FORMULARIO --- */
.label-premium {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: block;
}

.value-premium {
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  font-size: 1rem;
}

.text-box-premium {
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 0.9rem;
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
  transition: 0.3s;
  color: #1e293b;
}

.form-control-premium:focus {
  border-color: #10b981;
  outline: none;
  background: #fcfdfc;
}

.custom-switch .form-check-input {
  width: 3em;
  height: 1.5em;
  cursor: pointer;
}

.custom-switch .form-check-input:checked {
  background-color: #10b981;
  border-color: #10b981;
}

/* --- BOTONES --- */
.btn-success-premium {
  background: #2d4a22;
  color: #c0da63;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
  transition: 0.3s;
}

.btn-success-premium:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(45, 74, 34, 0.2);
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
  transition: 0.3s;
}
</style>