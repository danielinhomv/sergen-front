<template>
  <div class="confirmatory-ultrasound-container">

    <div v-if="isLoading" class="loading-container">
      <div class="spinner-container">
        <div class="pulsing-circle"></div>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>

    <div v-else class="result-container animate__animated animate__fadeIn">


        <button v-if="!showForm" class="btn btn-success shadow-sm fw-bold px-4 mb-4" @click="openAddForm">
          <i class="fas fa-plus me-2"></i>Nueva Ecografía
        </button>
      

      <div v-if="ultrasounds.length && !showForm" class="table-responsive rounded-4 shadow-sm border">
        <table class="table table-hover align-middle m-0">
          <thead class="bg-light-success text-success">
            <tr>
              <th class="ps-4">Fecha</th>
              <th>Estado</th>
              <th>Observación</th>
              <th class="text-end pe-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in ultrasounds" :key="item.id" class="transition-row">
              <td class="ps-4 fw-medium">{{ item.date }}</td>
              <td>
                <span :class="statusBadgeClass(item.status)">
                  {{ statusLabel(item.status) }}
                </span>
              </td>
              <td class="text-muted small">
                {{ item.observation || 'Sin observaciones' }}
              </td>
              <td class="text-end pe-4">
                <button class="btn btn-outline-warning btn-sm border-0 me-1" @click="openEditForm(item)">
                  <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-outline-danger btn-sm border-0" @click="deleteUltrasound(item.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else-if="!showForm" class="text-center py-5 border rounded-4 bg-light">
        <i class="fas fa-folder-open text-muted fs-1 mb-3"></i>
        <p class="text-muted fw-bold">No hay registros de ecografías confirmatorias.</p>
      </div>

      <div v-if="showForm" class="form-container p-4 bg-white border border-success-subtle rounded-4 shadow-sm">
        <h5 class="text-success fw-bold mb-4">
          <i class="fas fa-pen-square me-2"></i>{{ editing ? 'Editar Ecografía' : 'Registrar Ecografía' }}
        </h5>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Estado *</label>
              <select v-model="form.status" class="form-select border-success-subtle"
                :class="{ 'is-invalid': errors.status }">
                <option value="">Seleccione...</option>
                <option value="pregnant">Preñada</option>
                <option value="empty">Vacía</option>
                <option value="refuge">Refugio</option>
                <option value="discart">Descartada</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Fecha *</label>
              <input type="date" v-model="form.date" class="form-control border-success-subtle"
                :class="{ 'is-invalid': errors.date }" />
            </div>

            <div class="col-12">
              <label class="form-label fw-bold small text-uppercase">Observación</label>
              <textarea v-model="form.observation" class="form-control border-success-subtle" rows="3"
                placeholder="Detalles adicionales..."></textarea>
            </div>
          </div>

          <div class="d-flex gap-2 mt-4">
            <button class="btn btn-success px-4 shadow-sm fw-bold" type="submit" :disabled="!isFormValid || isSaving">
              <i class="fas fa-save me-2"></i>
              {{ isSaving ? 'Guardando...' : (editing ? 'Actualizar' : 'Guardar Registro') }}
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
import { ConfirmatoryUltrasoundService } from '@/services/management/ConfirmatoryUltrasoundService'

const service = new ConfirmatoryUltrasoundService()

/* =========================
   STATE
========================= */
const ultrasounds = ref([])
const isLoading = ref(true)
const isSaving = ref(false)
const loadingText = ref('Cargando...')
const intervalId = ref(null)

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
   VALIDACIONES
========================= */
watch(() => form.value, (val) => {
  errors.value.status = !val.status
  errors.value.date = !val.date
}, { deep: true })

const isFormValid = computed(() => !!form.value.status && !!form.value.date)

/* =========================
   TOAST HELPER
========================= */
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

/* =========================
   CRUD
========================= */
async function listUltrasounds() {
  isLoading.value = true
  try {
    // El servicio corregido ahora usa POST /all
    ultrasounds.value = await service.list()
  } catch (error) {
    showToast('error', 'Error al cargar la lista de ecografías.')
  } finally {
    isLoading.value = false
  }
}

function openAddForm() {
  editing.value = false
  form.value = { id: null, status: '', observation: '', date: new Date().toISOString().split('T')[0] }
  showForm.value = true
}

function openEditForm(item) {
  editing.value = true
  form.value = { ...item }
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
      showToast('success', 'Registro actualizado correctamente.')
    } else {
      await service.create(form.value)
      showToast('success', 'Registro creado con éxito.')
    }
    await listUltrasounds()
    showForm.value = false
  } catch (error) {
    showToast('error', 'Error al procesar la solicitud.')
  } finally {
    isSaving.value = false
  }
}

async function deleteUltrasound(id) {
  if (!confirm('¿Está seguro de eliminar esta ecografía?')) return
  try {
    await service.delete(id) // El servicio corregido usa POST /delete
    showToast('success', 'Registro eliminado.')
    await listUltrasounds()
  } catch (error) {
    showToast('error', 'No se pudo eliminar el registro.')
  }
}

/* =========================
   HELPERS
========================= */
function statusLabel(value) {
  const labels = { 'pregnant': 'Preñada', 'empty': 'Vacía', 'refuge': 'Refugio', 'discart': 'Descartada' }
  return labels[value] || value
}

function statusBadgeClass(value) {
  const classes = {
    'pregnant': 'badge bg-success shadow-sm',
    'empty': 'badge bg-danger shadow-sm',
    'refuge': 'badge bg-warning text-dark shadow-sm',
    'discart': 'badge bg-secondary shadow-sm'
  }
  return classes[value] || 'badge bg-light text-dark'
}

/* =========================
   LIFECYCLE
========================= */
onMounted(() => {
  startLoadingText()
  listUltrasounds().finally(() => stopLoadingText())
})

function startLoadingText() {
  let index = 0
  intervalId.value = setInterval(() => {
    index = (index + 1) % 4
    loadingText.value = ['Analizando...', 'Procesando...', 'Verificando...', 'Cargando...'][index]
  }, 2000)
}

function stopLoadingText() {
  if (intervalId.value) clearInterval(intervalId.value)
}
</script>

<style scoped>
.bg-light-success {
  background-color: #f0fdf4;
}

.transition-row:hover {
  background-color: #f8faf9;
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