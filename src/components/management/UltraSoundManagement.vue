<template>
  <div class="ultrasound-container">

    <div v-if="isLoading" class="loading-container">
      <div class="spinner-container">
        <div class="pulsing-circle"></div>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>

    <div v-else class="result-container animate__animated animate__fadeIn">

      <button v-if="!item && !showForm" class="btn btn-success shadow-sm fw-bold px-4" @click="openAddForm">
        <i class="fas fa-plus-circle me-2"></i>Registrar Ecografía
      </button>


      <div v-if="item && !showForm"
        class="detail-card border-start border-success border-4 shadow-sm bg-white p-4 rounded-4">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <div>
            <span :class="statusBadgeClass(item.status)" class="mb-2">
              {{ statusLabel(item.status) }}
            </span>
            <h5 class="fw-bold text-dark m-0">Resultado de Ecografía</h5>
          </div>
          <button class="btn btn-outline-warning btn-sm border-0" @click="openEditForm">
            <i class="fas fa-edit fs-5"></i>
          </button>
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <p class="mb-1 text-muted small text-uppercase fw-bold">Fecha</p>
            <p class="fw-medium"><i class="fas fa-calendar-alt me-2 text-success"></i>{{ item.date }}</p>
          </div>
          <div class="col-md-6">
            <p class="mb-1 text-muted small text-uppercase fw-bold">Vitaminas y Minerales</p>
            <p class="fw-medium">
              <i :class="item.vitamins_and_minerals ? 'fas fa-check text-success' : 'fas fa-times text-danger'"
                class="me-2"></i>
              {{ item.vitamins_and_minerals ? 'Aplicado' : 'No aplicado' }}
            </p>
          </div>
          <div class="col-md-6" v-if="item.work_team">
            <p class="mb-1 text-muted small text-uppercase fw-bold">Equipo de Trabajo</p>
            <p class="fw-medium text-dark">{{ item.work_team }}</p>
          </div>
          <div class="col-12" v-if="item.protocol_details">
            <p class="mb-1 text-muted small text-uppercase fw-bold">Detalles del Protocolo</p>
            <p class="text-muted small">{{ item.protocol_details }}</p>
          </div>
          <div class="col-12" v-if="item.used_products_summary">
            <p class="mb-1 text-muted small text-uppercase fw-bold">Productos Usados</p>
            <p class="text-muted small p-2 bg-light rounded border border-light-subtle">{{ item.used_products_summary }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="form-container p-4 bg-white border border-success-subtle rounded-4 shadow-sm">
        <h5 class="text-success fw-bold mb-4">
          <i class="fas fa-stethoscope me-2"></i>{{ editing ? 'Editar Registro' : 'Nueva Ecografía' }}
        </h5>

        <form @submit.prevent="submitForm">
          <div class="row g-3">

            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Estado *</label>
              <select v-model="form.status" class="form-select border-success-subtle"
                :class="{ 'is-invalid': errors.status }">
                <option value="">Seleccione...</option>
                <option value="pregnant">Preñada</option>
                <option value="implanted">Implantada</option>
                <option value="not_implanted">No implantada</option>
                <option value="discarded">Descartada</option>
              </select>
              <div class="invalid-feedback">Debe seleccionar un estado.</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Fecha *</label>
              <input type="date" v-model="form.date" class="form-control border-success-subtle"
                :class="{ 'is-invalid': errors.date }" />
              <div class="invalid-feedback">La fecha es obligatoria.</div>
            </div>

            <div class="col-12">
              <div class="form-check form-switch">
                <input class="form-check-input" type="checkbox" role="switch" id="vitaminsSwitch"
                  v-model="form.vitamins_and_minerals">
                <label class="form-check-label fw-bold text-muted" for="vitaminsSwitch">
                  ¿Se aplicaron Vitaminas y Minerales?
                </label>
              </div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Detalles del Protocolo</label>
              <textarea v-model="form.protocol_details" class="form-control border-success-subtle" rows="2"
                placeholder="Protocolo seguido..."></textarea>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Resumen de Productos</label>
              <textarea v-model="form.used_products_summary" class="form-control border-success-subtle" rows="2"
                placeholder="Productos utilizados..."></textarea>
            </div>

            <div class="col-12">
              <label class="form-label fw-bold small text-uppercase">Equipo de Trabajo</label>
              <input v-model="form.work_team" class="form-control border-success-subtle"
                placeholder="Personal encargado..." />
            </div>
          </div>

          <div class="d-flex gap-2 mt-4">
            <button class="btn btn-success px-4 shadow-sm fw-bold" type="submit" :disabled="!isFormValid || isSaving">
              <i class="fas fa-save me-2"></i>
              {{ isSaving ? 'Guardando...' : (editing ? 'Actualizar' : 'Guardar') }}
            </button>

            <button class="btn btn-outline-secondary px-4 fw-bold" type="button" @click="cancelForm">
              Cancelar
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

/* ======================
   STATE
====================== */
const item = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const loadingText = ref('Cargando ecografía...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  vitamins_and_minerals: false,
  status: '',
  protocol_details: '',
  used_products_summary: '',
  work_team: '',
  date: new Date().toISOString().split('T')[0]
})

const errors = ref({ status: false, date: false })

/* ======================
   VALIDACIONES REACTIVAS
====================== */
watch(() => form.value, () => {
  errors.value.status = !form.value.status
  errors.value.date = !form.value.date
}, { deep: true })

const isFormValid = computed(() => !!form.value.status && !!form.value.date)

/* ======================
   TOAST HELPER
====================== */
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

/* ======================
   CRUD
====================== */
async function loadItem() {
  isLoading.value = true
  try {
    const response = await service.get(sessionPropertyStore.controlBovineId)
    item.value = response || null
  } catch (error) {
    showToast('error', 'Error al obtener datos de ecografía.')
  } finally {
    isLoading.value = false
  }
}

function openAddForm() {
  editing.value = false
  form.value = {
    id: null, vitamins_and_minerals: false, status: '',
    protocol_details: '', used_products_summary: '', work_team: '',
    date: new Date().toISOString().split('T')[0]
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
      // service.update usa POST enviando ID en body
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

/* ======================
   HELPERS
====================== */
function statusLabel(value) {
  const map = {
    pregnant: 'Preñada',
    implanted: 'Implantada',
    not_implanted: 'No implantada',
    discarded: 'Descartada'
  }
  return map[value] || value
}

function statusBadgeClass(value) {
  const map = {
    pregnant: 'badge bg-success',
    implanted: 'badge bg-info text-dark',
    not_implanted: 'badge bg-warning text-dark',
    discarded: 'badge bg-danger'
  }
  return map[value] || 'badge bg-secondary'
}

/* ======================
   LIFECYCLE
====================== */
onMounted(() => {
  if (sessionPropertyStore.onScanned()) {
    loadItem()
  } else {
    showToast('warning', 'Debe escanear un bovino primero');
  }
});

</script>

<style scoped>
.result-container {
  width: 100%;
  max-width: 900px;
}

.detail-card {
  transition: transform 0.2s;
}

.detail-card:hover {
  transform: translateY(-3px);
}

.form-control:focus,
.form-select:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.25rem rgba(40, 167, 69, 0.1);
}

.pulsing-circle {
  width: 80px;
  height: 80px;
  background-color: #28a745;
  border-radius: 50%;
  animation: pulse 1.5s infinite ease-out;
}

@keyframes pulse {
  0% {
    transform: scale(0.6);
    opacity: 0.8;
  }

  100% {
    transform: scale(1.2);
    opacity: 0;
  }
}
</style>