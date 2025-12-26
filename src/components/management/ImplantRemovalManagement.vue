<template>
  <div class="implant-mobile-container">

    <div v-if="isLoading" class="loading-container">
      <div class="spinner-container">
        <div class="pulsing-circle"></div>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>

    <div v-else class="result-container animate__animated animate__fadeIn">

        <button v-if="!item && !showForm" class="btn btn-success shadow-sm fw-bold px-4" @click="openAddForm">
          <i class="fas fa-minus-circle me-2"></i>Registrar Retiro
        </button>


      <div v-if="item && !showForm" class="detail-card border-start border-success border-4 shadow-sm">
        <div class="detail-header mb-3">
          <h4 class="text-success fw-bold m-0">Retiro de Implante</h4>
          <button class="btn btn-warning btn-sm text-white px-3" @click="openEditForm">
            <i class="fas fa-edit me-1"></i> Editar
          </button>
        </div>

        <div class="row">
          <div class="col-md-6 mb-2">
            <strong><i class="fas fa-toggle-on me-2 text-muted"></i>Estado:</strong>
            <span :class="item.status === 'retrieved' ? 'badge bg-success' : 'badge bg-danger'" class="ms-2">
              {{ statusLabel(item.status) }}
            </span>
          </div>
          <div class="col-md-6 mb-2">
            <strong><i class="fas fa-calendar-alt me-2 text-muted"></i>Fecha:</strong> {{ item.date }}
          </div>
          <div class="col-12 mb-2" v-if="item.work_team">
            <strong><i class="fas fa-users me-2 text-muted"></i>Equipo:</strong> {{ item.work_team }}
          </div>
          <div class="col-12" v-if="item.used_products_summary">
            <strong><i class="fas fa-box-open me-2 text-muted"></i>Productos usados:</strong>
            <p class="text-muted small mb-0 ms-4">{{ item.used_products_summary }}</p>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="form-container mt-3 p-4 border rounded-4 bg-white shadow-sm">
        <h4 class="text-success fw-bold mb-4">
          <i class="fas fa-clipboard-check me-2"></i>{{ editing ? 'Editar Retiro' : 'Nuevo Registro' }}
        </h4>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Estado *</label>
              <select v-model="form.status" class="form-select border-success-subtle"
                :class="{ 'is-invalid': errors.status }">
                <option value="">Seleccione...</option>
                <option value="retrieved">Recuperado</option>
                <option value="lost">Perdido</option>
              </select>
              <div class="invalid-feedback">Debe seleccionar un estado</div>
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Fecha *</label>
              <input type="date" v-model="form.date" class="form-control border-success-subtle"
                :class="{ 'is-invalid': errors.date }" />
              <div class="invalid-feedback">La fecha es obligatoria</div>
            </div>

            <div class="col-md-12">
              <label class="form-label fw-bold small text-uppercase">Equipo de trabajo</label>
              <input v-model="form.work_team" class="form-control border-success-subtle"
                placeholder="Nombres del equipo..." />
            </div>

            <div class="col-12">
              <label class="form-label fw-bold small text-uppercase">Resumen de productos usados</label>
              <textarea v-model="form.used_products_summary" class="form-control border-success-subtle" rows="2"
                placeholder="Ej: Benzoato, Prostaglandina..."></textarea>
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
import { ImplantRemovalService } from '@/services/management/ImplantRemovalService'

const service = new ImplantRemovalService()

/* ======================
   STATE
====================== */
const item = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const loadingText = ref('Cargando...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  status: '',
  work_team: '',
  used_products_summary: '',
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
    const response = await service.get()
    item.value = response || null
  } catch (error) {
    showToast('error', 'Error al cargar los datos del implante.')
  } finally {
    isLoading.value = false
  }
}

function openAddForm() {
  editing.value = false
  form.value = {
    id: null, status: '', work_team: '',
    used_products_summary: '', date: new Date().toISOString().split('T')[0]
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
      // Service usa POST /update enviando ID en body
      await service.update(form.value.id, form.value)
      showToast('success', 'Registro actualizado.')
    } else {
      await service.create(form.value)
      showToast('success', 'Retiro registrado con éxito.')
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    showToast('error', 'Error al guardar el registro.')
  } finally {
    isSaving.value = false
  }
}

/* ======================
   HELPERS
====================== */
function statusLabel(value) {
  return value === 'retrieved' ? 'Recuperado' : 'Perdido'
}

/* ======================
   LIFECYCLE
====================== */
onMounted(loadItem)
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