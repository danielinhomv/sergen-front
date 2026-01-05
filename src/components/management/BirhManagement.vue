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
            <strong><i class="fas fa-baby me-2 text-muted"></i>Tipo:</strong>
            <span class="badge bg-secondary ms-2">{{ typeOfBirthLabel(item.typeOfBirth) }}</span>
          </div>
          <div v-if="item.bullFather" class="col-md-12 mb-2">
            <strong><i class="fas fa-dna me-2 text-muted"></i>Toro Padre:</strong> {{ item.bullFather }}
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
                <option value="male">Macho</option>
                <option value="female">Hembra</option>
              </select>
              <div class="invalid-feedback">Campo obligatorio</div>
            </div>

            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">Peso al nacer (kg) *</label>
              <input type="number" min="0.1" step="0.1" v-model="form.birthWeight" class="form-control"
                :class="{ 'is-invalid': errors.birthWeight }" />
              <div class="invalid-feedback">Campo obligatorio y debe ser > 0</div>
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

            <div class="col-md-6 mb-3">
              <label class="form-label fw-bold">RGD (Opcional)</label>
              <input type="text" v-model="form.rgd" class="form-control" placeholder="Ej: RGD12345" />
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

      <hr class="my-5" />
      <BullManagement />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Toast } from 'bootstrap'
import { BirthService } from '@/services/management/BirthService'
import { Birth } from '@/model/management/Birth'
import BullManagement from '@/components/management/BullManagement.vue'
import { useSessionPropertyStore } from '@/store/SessionProperty'

const birthService = new BirthService()
const sessionPropertyStore = useSessionPropertyStore()

/* ======================
   ESTADO
====================== */
const item = ref(null)
const isLoading = ref(true)
const isSaving = ref(false)
const loadingText = ref('Cargando datos del parto...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  birthdate: '',
  sex: '',
  birthWeight: '',
  typeOfBirth: '',
  rgd: '',
  controlBovineId: null,
  bovineId: null, // ID de la madre
  propertyId: null
})

const errors = ref({
  birthdate: false,
  sex: false,
  birthWeight: false,
  typeOfBirth: false
})

/* ======================
   VALIDACIÓN
====================== */
watch(() => form.value, () => {
  errors.value = {
    birthdate: !form.value.birthdate,
    sex: !form.value.sex,
    birthWeight: !form.value.birthWeight || parseFloat(form.value.birthWeight) <= 0,
    typeOfBirth: !form.value.typeOfBirth
  }
}, { deep: true })

const isFormValid = computed(() => {
  return (
    form.value.birthdate &&
    form.value.sex &&
    form.value.birthWeight > 0 &&
    form.value.typeOfBirth &&
    form.value.propertyId &&
    form.value.controlBovineId
  )
})

/* ======================
   CRUD
====================== */
async function loadItem() {
  isLoading.value = true
  try {
    // Usamos el ID del control escaneado desde el store
    const response = await birthService.get(sessionPropertyStore.getControlBovineId)
    item.value = response // El servicio ya devuelve la instancia de Birth mediante fromJson
  } catch (error) {
    console.error("Load error:", error)
    item.value = null
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
    rgd: '',
    controlBovineId: sessionPropertyStore.getControlBovineId,
    bovineId: sessionPropertyStore.getBovineId, // Madre
    propertyId: sessionPropertyStore.getPropertyId // Muy importante para el repo de Laravel
  }
  showForm.value = true
}

function openEditForm() {
  editing.value = true
  // Clonamos el item actual al formulario
  form.value = { 
    ...item.value, 
    bovineId: sessionPropertyStore.getBovineId,
    propertyId: sessionPropertyStore.getPropertyId 
  }
  showForm.value = true
}

async function submitForm() {
  if (!isFormValid.value) return

  isSaving.value = true
  try {
    const birthData = new Birth(form.value)
    if (editing.value) {
      await birthService.updateBirth(form.value.id, birthData)
      showToast('success', '¡Parto actualizado!')
    } else {
      await birthService.createBirth(birthData)
      showToast('success', '¡Parto registrado con éxito!')
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    showToast('error', error.message || 'Error al guardar')
  } finally {
    isSaving.value = false
  }
}

function cancelForm() {
  showForm.value = false
}

/* ======================
   HELPERS UI
====================== */
function sexLabel(value) {
  return value === 'male' ? 'Macho' : 'Hembra'
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

function showToast(type, message) {
  // Asegúrate de tener este elemento en tu App.vue o layout principal
  const toastEl = document.getElementById('liveToast')
  if (toastEl) {
    const toastBody = toastEl.querySelector('.toast-body') || toastEl
    toastBody.textContent = message
    const bsToast = new Toast(toastEl)
    bsToast.show()
  } else {
    alert(message) // Fallback si no hay Toast configurado
  }
}

/* ======================
   LIFECYCLE
====================== */
onMounted(() => {
  // Verificamos que haya datos de escaneo
  if (sessionPropertyStore.getControlBovineId) {
    loadItem()
  } else {
    isLoading.value = false
    showToast('warning', 'No hay un bovino seleccionado.')
  }
})
</script>

<style scoped>
/* (Se mantienen tus estilos originales que están muy bien) */
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
  width: 60px;
  height: 60px;
  background-color: #28a745;
  border-radius: 50%;
  animation: pulse 1.5s infinite ease-out;
}
@keyframes pulse {
  0% { transform: scale(0.6); opacity: 0.8; }
  100% { transform: scale(1.2); opacity: 0; }
}
</style>