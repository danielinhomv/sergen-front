<template>
  <div class="birth-container">

    <div v-if="isLoading" class="loading-container">
      <div class="spinner-container">
        <div class="pulsing-circle"></div>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>

    <div v-else class="result-container animate__animated animate__fadeIn">

      <button v-if="!item && !showForm" class="btn btn-success mb-3 shadow-sm fw-bold" @click="openAddForm">
        <i class="fas fa-plus me-2"></i>Registrar Parto
      </button>

      <div v-if="item && !showForm" class="detail-card border-start border-success border-4 shadow-sm">
        <div class="detail-header mb-3">
          <h4 class="text-success fw-bold m-0">Información del Parto</h4>
          <button class="btn btn-warning btn-sm text-white" @click="openEditForm">
            <i class="fas fa-edit me-1"></i> Editar
          </button>
        </div>

        <div class="row">
          <div class="col-md-6 mb-2">
            <strong><i class="fas fa-calendar-alt me-2 text-muted"></i>Fecha:</strong> {{ item.birthdate }}
          </div>
          <div class="col-md-6 mb-2">
            <strong><i class="fas fa-venus-mars me-2 text-muted"></i>Sexo:</strong>
            <span class="badge bg-info ms-2">{{ sexLabel(item.sex) }}</span>
          </div>
          <div class="col-md-6 mb-2">
            <strong><i class="fas fa-weight me-2 text-muted"></i>Peso:</strong> {{ item.birthWeight }} kg
          </div>
          <div class="col-md-6 mb-2">
            <strong><i class="fas fa- baby me-2 text-muted"></i>Tipo:</strong>
            <span class="badge bg-secondary ms-2">{{ typeOfBirthLabel(item.typeOfBirth) }}</span>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="form-container mt-3 p-4 border rounded-4 bg-white shadow">
        <h4 class="text-success fw-bold mb-4">
          <i class="fas fa-clipboard-list me-2"></i>{{ editing ? 'Editar Parto' : 'Registrar Parto' }}
        </h4>

        <form @submit.prevent="submitForm">
          <div class="row">
            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Fecha de parto *</label>
              <input type="date" v-model="form.birthdate" class="form-control"
                :class="{ 'is-invalid': errors.birthdate }" />
              <div class="invalid-feedback">Campo obligatorio</div>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Sexo *</label>
              <select v-model="form.sex" class="form-select" :class="{ 'is-invalid': errors.sex }">
                <option value="">Seleccione...</option>
                <option value="macho">Macho</option>
                <option value="hembra">Hembra</option>
              </select>
              <div class="invalid-feedback">Campo obligatorio</div>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Peso al nacer (kg) *</label>
              <input type="number" min="0.1" step="0.1" v-model="form.birthWeight" class="form-control"
                :class="{ 'is-invalid': errors.birthWeight }" />
              <div class="invalid-feedback">Campo obligatorio</div>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Tipo de parto *</label>
              <select v-model="form.typeOfBirth" class="form-select" :class="{ 'is-invalid': errors.typeOfBirth }">
                <option value="">Seleccione...</option>
                <option value="normal">Normal / A término</option>
                <option value="premeture">Prematuro</option>
                <option value="abort">Aborto</option>
                <option value="stillbirth">Muerte al nacer</option>
              </select>
              <div class="invalid-feedback">Campo obligatorio</div>
            </div>
          </div>

          <div class="d-flex gap-2 mt-3">
            <button type="submit" class="btn btn-success px-4" :disabled="!isFormValid || isSaving">
              <i class="fas fa-save me-2"></i> {{ isSaving ? 'Guardando...' : (editing ? 'Actualizar' : 'Guardar') }}
            </button>
            <button type="button" class="btn btn-outline-secondary px-4" @click="cancelForm">
              Cancelar
            </button>
          </div>
        </form>
      </div>

      <div class="modal fade" id="textViewerModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg">
            <div class="modal-header bg-success text-white">
              <h5 class="modal-title"><i class="fas fa-file-alt me-2"></i>{{ fullTextTitle }}</h5>
              <button type="button" class="btn-close btn-close-white" @click="closeTextViewerModal"></button>
            </div>
            <div class="modal-body">
              <p style="white-space: pre-wrap;" class="text-dark">{{ fullTextContent }}</p>
            </div>
            <div class="modal-footer border-0">
              <button @click="closeTextViewerModal" type="button" class="btn btn-secondary px-4">Cerrar</button>
            </div>
          </div>
        </div>
      </div>

      <hr class="my-5" />
      <BullManagement />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Toast, Modal } from 'bootstrap'
import { BirthService } from '@/services/management/BirthService'
import { Birth } from '@/model/management/Birth'
import BullManagement from '@/components/management/BullManagement.vue'
import { useSessionPropertyStore } from '@/store/SessionProperty'

const birthService = new BirthService()
const sessionPropertyStore = useSessionPropertyStore()

/* ======================
   STATE
====================== */
const item = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const loadingText = ref('Cargando datos...')
const showForm = ref(false)
const editing = ref(false)

// Visor Modal State
const fullTextTitle = ref('')
const fullTextContent = ref('')
let bootstrapModal = null

const form = ref({
  id: null,
  birthdate: '',
  sex: '',
  birthWeight: '',
  typeOfBirth: '',
  controlBovineId: 5 // Esto debería venir dinámicamente según tu lógica
})

const errors = ref({
  birthdate: false,
  sex: false,
  birthWeight: false,
  typeOfBirth: false
})

/* ======================
   VALIDACIÓN REACTIVA
====================== */
watch(() => form.value, () => {
  errors.value = {
    birthdate: !form.value.birthdate,
    sex: !form.value.sex,
    birthWeight: form.value.birthWeight === '' || form.value.birthWeight === null || parseFloat(form.value.birthWeight) <= 0,
    typeOfBirth: !form.value.typeOfBirth
  }
}, { deep: true })

const isFormValid = computed(() => {
  return (
    form.value.birthdate &&
    form.value.sex &&
    form.value.birthWeight > 0 && // El peso debe ser mayor a cero
    form.value.typeOfBirth &&
    !errors.value.birthWeight // Refuerzo de seguridad
  )
})

/* ======================
   HELPERS UI (TOAST)
====================== */
function showToast(type, message) {
  const toastEl = document.getElementById('liveToast');
  if (!toastEl) return;

  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  toastEl.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning');

  let iconHtml = '';
  if (type === 'success') {
    toastEl.classList.add('text-bg-success');
    iconHtml = '<i class="fas fa-check-circle fs-5"></i>';
  } else if (type === 'error') {
    toastEl.classList.add('text-bg-danger');
    iconHtml = '<i class="fas fa-times-circle fs-5"></i>';
  } else if (type === 'warning') {
    toastEl.classList.add('text-bg-warning');
    iconHtml = '<i class="fas fa-exclamation-triangle fs-5"></i>';
  }

  toastMessage.textContent = message;
  toastIcon.innerHTML = iconHtml;

  const toast = Toast.getInstance(toastEl) || new Toast(toastEl, { delay: 4000 });
  toast.show();
}

/* ======================
   CRUD
====================== */
async function loadItem() {
  isLoading.value = true
  try {
    const response = await birthService.get(sessionPropertyStore.controlBovineId)
    if (response) {
      item.value = response
    } else {
      item.value = null
    }
  } catch (error) {
    showToast('error', 'No se pudieron cargar los datos del parto.')
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

function openAddForm() {
  editing.value = false
  form.value = {
    id: null,
    birthdate: new Date().toISOString().split('T')[0],
    sex: '',
    birthWeight: '',
    typeOfBirth: 'normal',
    controlBovineId: 5
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
  if (!isFormValid.value) {
    showToast('warning', 'Por favor complete todos los campos obligatorios.')
    return
  }

  isSaving.value = true
  try {
    const birthData = new Birth(form.value)
    if (editing.value) {
      await birthService.updateBirth(form.value.id, birthData)
      showToast('success', 'Parto actualizado correctamente.')
    } else {
      await birthService.createBirth(birthData)
      showToast('success', 'Parto registrado correctamente.')
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    showToast('error', 'Ocurrió un error al guardar los datos.')
    console.error(error)
  } finally {
    isSaving.value = false
  }
}

/* ======================
   MODAL HELPERS
====================== */
function closeTextViewerModal() {
  if (bootstrapModal) bootstrapModal.hide()
}

function sexLabel(value) {
  return value === 'macho' ? 'Macho' : 'Hembra'
}

function typeOfBirthLabel(value) {
  const types = {
    'normal': 'Normal / A término',
    'premeture': 'Prematuro',
    'abort': 'Aborto',
    'stillbirth': 'Muerte al nacer'
  }
  return types[value] || value
}

/* ======================
   LIFECYCLE
====================== */
onMounted(() => {
  if (sessionPropertyStore.onScanned()) {
    loadItem()
    const modalEl = document.getElementById('textViewerModal')
    if (modalEl) bootstrapModal = new Modal(modalEl)
  } else {
    showToast('warning', 'Debe escanear un bovino primero');
  }
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

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Loader Animation */
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