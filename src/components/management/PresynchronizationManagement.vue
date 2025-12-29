<template>
  <div class="presynch-container">

    <div v-if="isLoading" class="loading-container">
      <div class="spinner-container">
        <div class="pulsing-circle"></div>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>

    <div v-else class="result-container animate__animated animate__fadeIn">

        <button v-if="!item && !showForm" class="btn btn-success shadow-sm fw-bold px-4" @click="openAddForm">
          <i class="fas fa-plus-circle me-2"></i>Registrar Pre-sincronizacion
        </button>


      <div v-if="item && !showForm"
        class="detail-card border-start border-success border-4 shadow-sm bg-white p-4 rounded-4">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h5 class="fw-bold text-dark m-0">Protocolo Aplicado</h5>
          <button class="btn btn-outline-warning btn-sm border-0" @click="openEditForm">
            <i class="fas fa-edit fs-5"></i>
          </button>
        </div>

        <div class="row g-3">
          <div class="col-md-6">
            <p class="mb-1 text-muted small text-uppercase fw-bold">Fecha Aplicación</p>
            <p class="fw-medium text-success"><i class="fas fa-calendar-alt me-2"></i>{{ item.application_date }}</p>
          </div>
          <div class="col-md-6">
            <p class="mb-1 text-muted small text-uppercase fw-bold">Vitaminas y Minerales</p>
            <p class="fw-medium">
              <i :class="item.vitamins_and_minerals ? 'fas fa-check-circle text-success' : 'fas fa-times-circle text-danger'"
                class="me-2"></i>
              {{ item.vitamins_and_minerals ? 'Aplicado' : 'No aplicado' }}
            </p>
          </div>
          <div class="col-md-4">
            <p class="mb-1 text-muted small text-uppercase fw-bold">Vacuna Reproductiva</p>
            <p class="fw-medium text-dark">{{ item.reproductive_vaccine }}</p>
          </div>
          <div class="col-md-4">
            <p class="mb-1 text-muted small text-uppercase fw-bold">Sincrogest</p>
            <p class="fw-medium text-dark">{{ item.sincrogest_product }}</p>
          </div>
          <div class="col-md-4">
            <p class="mb-1 text-muted small text-uppercase fw-bold">Antiparasitario</p>
            <p class="fw-medium text-dark">{{ item.antiparasitic_product }}</p>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="form-container p-4 bg-white border border-success-subtle rounded-4 shadow-sm">
        <h5 class="text-success fw-bold mb-4">
          <i class="fas fa-clipboard-list me-2"></i>{{ editing ? 'Editar Protocolo' : 'Nuevo Registro de Protocolo' }}
        </h5>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Vacuna Reproductiva *</label>
              <input v-model="form.reproductive_vaccine" class="form-control border-success-subtle"
                :class="{ 'is-invalid': errors.reproductive_vaccine }" placeholder="Nombre de la vacuna" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Sincrogest *</label>
              <input v-model="form.sincrogest_product" class="form-control border-success-subtle"
                :class="{ 'is-invalid': errors.sincrogest_product }" placeholder="Producto Sincrogest" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Antiparasitario *</label>
              <input v-model="form.antiparasitic_product" class="form-control border-success-subtle"
                :class="{ 'is-invalid': errors.antiparasitic_product }" placeholder="Nombre antiparasitario" />
            </div>

            <div class="col-md-6">
              <label class="form-label fw-bold small text-uppercase">Fecha de Aplicación *</label>
              <input type="date" v-model="form.application_date" class="form-control border-success-subtle"
                :class="{ 'is-invalid': errors.application_date }" />
            </div>

            <div class="col-12">
              <div class="form-check form-switch mt-2">
                <input class="form-check-input" type="checkbox" role="switch" id="vitaminsSwitch"
                  v-model="form.vitamins_and_minerals">
                <label class="form-check-label fw-bold text-muted" for="vitaminsSwitch">
                  ¿Se aplicaron Vitaminas y Minerales?
                </label>
              </div>
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
import { PresynchronizationService } from '@/services/management/PresynchronizationService'
import { useSessionPropertyStore } from '@/store/SessionProperty'

const service = new PresynchronizationService()
const sessionPropertyStore = useSessionPropertyStore()

/* ======================
   STATE
====================== */
const item = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const loadingText = ref('Cargando pre-sincronización...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  reproductive_vaccine: '',
  sincrogest_product: '',
  antiparasitic_product: '',
  vitamins_and_minerals: true,
  application_date: new Date().toISOString().split('T')[0]
})

const errors = ref({
  reproductive_vaccine: false,
  sincrogest_product: false,
  antiparasitic_product: false,
  application_date: false
})

/* ======================
   VALIDACIONES EN TIEMPO REAL
====================== */
watch(() => form.value, () => {
  errors.value.reproductive_vaccine = !form.value.reproductive_vaccine
  errors.value.sincrogest_product = !form.value.sincrogest_product
  errors.value.antiparasitic_product = !form.value.antiparasitic_product
  errors.value.application_date = !form.value.application_date
}, { deep: true })

const isFormValid = computed(() => {
  return (
    !!form.value.reproductive_vaccine &&
    !!form.value.sincrogest_product &&
    !!form.value.antiparasitic_product &&
    !!form.value.application_date
  )
})

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
    showToast('error', 'Error al cargar los datos.')
  } finally {
    isLoading.value = false
  }
}

function openAddForm() {
  editing.value = false
  form.value = {
    id: null, reproductive_vaccine: '', sincrogest_product: '',
    antiparasitic_product: '', vitamins_and_minerals: true,
    application_date: new Date().toISOString().split('T')[0]
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
      // Usando POST /update con ID en body (según el servicio corregido)
      await service.update(form.value.id, form.value)
      showToast('success', 'Protocolo actualizado correctamente.')
    } else {
      await service.create(form.value)
      showToast('success', 'Protocolo registrado correctamente.')
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    showToast('error', 'Ocurrió un error al guardar.')
  } finally {
    isSaving.value = false
  }
}

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

.form-control:focus {
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