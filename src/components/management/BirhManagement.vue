<template>
  <div class="birth-container">

    <!-- LOADER -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner-container">
        <div class="pulsing-circle"></div>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>

    <!-- CONTENIDO -->
    <div v-else class="result-container">

      <!-- BOTÓN AGREGAR -->
      <button
        v-if="!item && !showForm"
        class="btn btn-primary mb-3"
        @click="openAddForm"
        :disabled="!!item"
      >
        Registrar Parto
      </button>

      <!-- DETALLE DEL PARTO -->
      <div v-if="item && !showForm" class="detail-card">
        <div class="detail-header">
          <h4>Parto</h4>
          <button class="btn btn-warning btn-sm" @click="openEditForm">
            ✏️
          </button>
        </div>

        <p><strong>Fecha:</strong> {{ item.birthdate }}</p>
        <p><strong>Sexo:</strong> {{ sexLabel(item.sex) }}</p>
        <p><strong>Peso al nacer:</strong> {{ item.birthWeight }} kg</p>
        <p><strong>Tipo de parto:</strong> {{ typeOfBirthLabel(item.typeOfBirth) }}</p>

      </div>

      <!-- FORMULARIO -->
      <div v-if="showForm" class="form-container mt-3 p-3 border rounded">
        <h4>{{ editing ? 'Editar Parto' : 'Registrar Parto' }}</h4>

        <form @submit.prevent="submitForm">

          <div class="mb-2">
            <label>Fecha de parto *</label>
            <input type="date" v-model="form.birthdate" class="form-control" 
              :class="{ 'is-invalid': errors.birthdate }" />
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

          <div class="mb-2">
            <label>Sexo *</label>
            <select v-model="form.sex" class="form-select" 
              :class="{ 'is-invalid': errors.sex }">
              <option value="">Seleccione...</option>
              <option value="macho">Macho</option>
              <option value="hembra">Hembra</option>
            </select>
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

          <div class="mb-2">
            <label>Peso al nacer (kg) *</label>
            <input type="number" v-model="form.birthWeight" class="form-control" 
              :class="{ 'is-invalid': errors.birthWeight }" />
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

          <div class="mb-2">
            <label>Tipo de parto *</label>
            <select v-model="form.typeOfBirth" class="form-select" 
              :class="{ 'is-invalid': errors.typeOfBirth }">
              <option value="">Seleccione...</option>
              <option value="premeture">Prematuro</option>
              <option value="abort">Aborto</option>
              <option value="stillbirth">Muerte al nacer</option>
            </select>
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

          <button type="submit" class="btn btn-success mt-2" :disabled="!isFormValid">
            {{ editing ? 'Actualizar' : 'Guardar' }}
          </button>

          <button type="button" class="btn btn-secondary mt-2 ms-2" @click="cancelForm">
            Cancelar
          </button>
        </form>
      </div>

      <!-- GESTIÓN DE TOROS -->
      <hr class="my-4" />
      <BullManagement />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { BirthService } from '@/services/management/BirthService'
import { Birth } from '@/model/management/Birth'
import BullManagement from '@/components/management/BullManagement.vue'

const birthService = new BirthService()

/* ======================
   STATE
====================== */
const item = ref(null)
const isLoading = ref(true)
const loadingText = ref('Escaneando...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  birthdate: '',
  sex: '',
  birthWeight: '',
  typeOfBirth: '',
  controlBovineId: 5
})

const errors = ref({})

/* ======================
   VALIDACIÓN REACTIVA
====================== */
watch(form, () => {
  errors.value = {
    birthdate: !form.value.birthdate,
    sex: !form.value.sex,
    birthWeight: !form.value.birthWeight,
    typeOfBirth: !form.value.typeOfBirth
  }
}, { deep: true })

const isFormValid = computed(() => {
  return Object.values(errors.value).every(e => e === false)
})

/* ======================
   CRUD
====================== */
async function loadItem() {
  isLoading.value = true
  try {
    const response = await birthService.get() // Devuelve un solo parto por bovino
    if (response) {
      item.value = response
      form.value = { ...response }
      editing.value = true
    } else {
      item.value = null
      form.value = { id: null, birthdate: '', sex: '', birthWeight: '', typeOfBirth: '', controlBovineId: 5 }
      editing.value = false
    }
  } catch (error) {
    console.error('Error cargando parto:', error)
  } finally {
    isLoading.value = false
  }
}

function openAddForm() {
  editing.value = false
  form.value = { id: null, birthdate: '', sex: '', birthWeight: '', typeOfBirth: '', controlBovineId: 5 }
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

  try {
    const birth = new Birth(form.value)
    if (editing.value) {
      await birthService.updateBirth(form.value.id, birth)
    } else {
      await birthService.createBirth(birth)
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    console.error('Error guardando parto:', error)
  }
}

/* ======================
   HELPERS
====================== */
function sexLabel(value) {
  return value === 'macho' ? 'Macho' : 'Hembra'
}

function typeOfBirthLabel(value) {
  switch(value) {
    case 'premeture': return 'Prematuro'
    case 'abort': return 'Aborto'
    case 'stillbirth': return 'Muerte al nacer'
    default: return value
  }
}

/* ======================
   LIFECYCLE
====================== */
onMounted(() => {
  loadItem()
})
</script>

<style scoped>
.birth-container {
  display: flex;
  justify-content: center;
}

.loading-container {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.spinner-container {
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
}

.pulsing-circle {
  width: 100px;
  height: 100px;
  background-color: #388e3c;
  border-radius: 50%;
  animation: pulse 2s infinite ease-out;
}

.loading-text {
  color: #388e3c;
  font-size: 1.2rem;
}

.result-container {
  width: 100%;
  max-width: 900px;
  background: #fff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
}

.detail-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-container {
  background: #f8f9fa;
  margin-top: 1rem;
  border-radius: 12px;
}

@keyframes pulse {
  0% { transform: scale(0.6); opacity: 0.5 }
  50% { transform: scale(1.1); opacity: 0 }
  100% { transform: scale(0.6); opacity: 0.5 }
}
</style>
