<template>
  <div class="palpation-container">

    <div v-if="isLoading" class="loading-container">
      <div class="spinner-container">
        <div class="pulsing-circle"></div>
      </div>
      <p class="loading-text">Cargando datos de palpación...</p>
    </div>

    <div v-else class="result-container animate__animated animate__fadeIn">

      <button v-if="!item && !showForm" class="btn btn-success mb-3 shadow-sm fw-bold px-4" @click="openAddForm">
        <i class="fas fa-hand-holding-medical me-2"></i>Registrar Palpación
      </button>

      <div v-if="item && !showForm" class="detail-card border-start border-success border-4 shadow-sm">
        <div class="detail-header mb-3">
          <h4 class="text-success fw-bold m-0">Palpación General</h4>
          <button class="btn btn-warning btn-sm text-white px-3" @click="openEditForm">
            <i class="fas fa-edit me-1"></i> Editar
          </button>
        </div>

        <div class="row">
          <div class="col-md-6 mb-2">
            <strong><i class="fas fa-info-circle me-2 text-muted"></i>Estado:</strong>
            <span :class="statusBadgeClass(item.status)" class="ms-2">
              {{ statusLabel(item.status) }}
            </span>
          </div>
          <div class="col-md-6 mb-2">
            <strong><i class="fas fa-calendar-alt me-2 text-muted"></i>Fecha:</strong> {{ item.date }}
          </div>
          <div class="col-12 mt-2" v-if="item.observation">
            <strong><i class="fas fa-comment-dots me-2 text-muted"></i>Observación:</strong>
            <p class="mt-1 text-muted ms-4">{{ item.observation }}</p>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="form-container mt-3 p-4 border rounded-4 bg-white shadow-sm">
        <h4 class="text-success fw-bold mb-4">
          <i class="fas fa-file-medical me-2"></i>{{ editing ? 'Editar Palpación' : 'Nueva Palpación' }}
        </h4>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Estado *</label>
              <select v-model="form.status" class="form-select border-success-subtle"
                :class="{ 'is-invalid': errors.status }">
                <option value="">Seleccione...</option>
                <option value="pregnant">Preñada</option>
                <option value="empty">Vacía</option>
                <option value="discard">Descartada</option>
                <option value="abort">Abortada</option>
              </select>
              <div class="invalid-feedback">Debe seleccionar un estado</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Fecha *</label>
              <input type="date" v-model="form.date" class="form-control border-success-subtle"
                :class="{ 'is-invalid': errors.date }" />
              <div class="invalid-feedback">La fecha es obligatoria</div>
            </div>

            <div class="col-12">
              <label class="form-label fw-bold small text-uppercase">Observación</label>
              <textarea v-model="form.observation" class="form-control border-success-subtle" rows="3"
                placeholder="Escriba detalles relevantes aquí..."></textarea>
            </div>
          </div>

          <div class="d-flex gap-2 mt-4">
            <button class="btn btn-success px-4 shadow-sm fw-bold" type="submit" :disabled="!isFormValid || isSaving">
              <i class="fas fa-save me-2"></i>
              {{ isSaving ? 'Guardando...' : (editing ? 'Actualizar' : 'Guardar Palpación') }}
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
import { GeneralPalpationService } from '@/services/management/GeneralPalpationService'

const service = new GeneralPalpationService()

/* ======================
   STATE
====================== */
const item = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  status: '',
  observation: '',
  date: new Date().toISOString().split('T')[0]
})

const errors = ref({ status: false, date: false })

/* ======================
   VALIDACIONES
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
    const response = await service.get()
    if (response) {
      item.value = response
    } else {
      item.value = null
    }
  } catch (error) {
    showToast('error', 'Error al cargar los datos de palpación.')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

function openAddForm() {
  form.value = {
    id: null,
    status: '',
    observation: '',
    date: new Date().toISOString().split('T')[0]
  }
  editing.value = false
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
      // Usando el servicio corregido con POST y sin ID en URL
      await service.update(form.value.id, form.value)
      showToast('success', 'Palpación actualizada correctamente.')
    } else {
      await service.create(form.value)
      showToast('success', 'Palpación registrada con éxito.')
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    showToast('error', 'Hubo un error al guardar los datos.')
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

/* ======================
   HELPERS
====================== */
function statusLabel(value) {
  const labels = {
    'pregnant': 'Preñada',
    'empty': 'Vacía',
    'discard': 'Descartada',
    'abort': 'Abortada'
  }
  return labels[value] || value
}

function statusBadgeClass(value) {
  const classes = {
    'pregnant': 'badge bg-success',
    'empty': 'badge bg-danger',
    'discard': 'badge bg-secondary',
    'abort': 'badge bg-warning text-dark'
  }
  return classes[value] || 'badge bg-light text-dark'
}

/* ======================
   LIFECYCLE
====================== */
onMounted(() => {
  loadItem()
})
</script>

<style scoped>
.result-container {
  width: 100%;
  max-width: 900px;
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
}

.detail-card {
  background: #fdfdfd;
  padding: 1.5rem;
  border-radius: 12px;
}

.form-control:focus,
.form-select:focus {
  border-color: #28a745;
  box-shadow: 0 0 0 0.25rem rgba(40, 167, 69, 0.1);
}

.loading-container {
  min-height: 40vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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