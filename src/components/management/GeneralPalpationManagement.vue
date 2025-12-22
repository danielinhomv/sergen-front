<template>
  <div class="palpation-container">

    <!-- LOADER -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner-container">
        <div class="pulsing-circle"></div>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>

    <!-- CONTENIDO -->
    <div v-else class="result-container">

      <!-- BOTÓN REGISTRAR (solo si no existe) -->
      <button
        v-if="!item && !showForm"
        class="btn btn-primary mb-3"
        @click="openAddForm"
        :disabled="!!item"
      >
        Registrar Palpación
      </button>

      <!-- DETALLE -->
      <div v-if="item && !showForm" class="detail-card">
        <div class="detail-header">
          <h4>Palpación General</h4>
          <button class="btn btn-warning btn-sm" @click="openEditForm">
            ✏️
          </button>
        </div>

        <p><strong>Estado:</strong> {{ statusLabel(item.status) }}</p>

        <p v-if="item.observation">
          <strong>Observación:</strong> {{ item.observation }}
        </p>

        <p><strong>Fecha:</strong> {{ item.date }}</p>
      </div>

      <!-- FORMULARIO -->
      <div v-if="showForm" class="form-container mt-3 p-3 border rounded">
        <h4>{{ editing ? 'Editar Palpación' : 'Registrar Palpación' }}</h4>

        <form @submit.prevent="submitForm">

          <!-- STATUS -->
          <div class="mb-2">
            <label>Estado *</label>
            <select
              v-model="form.status"
              class="form-select"
              :class="{ 'is-invalid': errors.status }"
            >
              <option value="">Seleccione...</option>
              <option value="pregnant">Preñada</option>
              <option value="empty">Vacía</option>
              <option value="discard">Descartada</option>
              <option value="abort">Abortada</option>
            </select>
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

          <!-- OBSERVACIÓN OPCIONAL -->
          <div class="mb-2">
            <label>Observación</label>
            <textarea v-model="form.observation" class="form-control"></textarea>
          </div>

          <!-- FECHA -->
          <div class="mb-2">
            <label>Fecha *</label>
            <input
              type="date"
              v-model="form.date"
              class="form-control"
              :class="{ 'is-invalid': errors.date }"
            />
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

          <button
            class="btn btn-success mt-2"
            type="submit"
            :disabled="!isFormValid"
          >
            {{ editing ? 'Actualizar' : 'Guardar' }}
          </button>

          <button
            class="btn btn-secondary mt-2 ms-2"
            type="button"
            @click="cancelForm"
          >
            Cancelar
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { GeneralPalpationService } from '@/services/management/GeneralPalpationService'

const service = new GeneralPalpationService()

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
  status: '',
  observation: '',
  date: ''
})

const errors = ref({})

/* ======================
   VALIDACIONES REACTIVAS
====================== */
watch(form, () => {
  errors.value = {
    status: !form.value.status,
    date: !form.value.date
  }
}, { deep: true })

const isFormValid = computed(() => !!form.value.status && !!form.value.date)

/* ======================
   CRUD
====================== */
async function loadItem() {
  isLoading.value = true
  try {
    const response = await service.get()
    if (response) {
      item.value = response
      form.value = { ...response }
      editing.value = true
    } else {
      item.value = null
      form.value = { id: null, status: '', observation: '', date: '' }
      editing.value = false
    }
  } catch (error) {
    console.error('Error cargando palpación:', error)
  } finally {
    isLoading.value = false
  }
}

function openAddForm() {
  form.value = { id: null, status: '', observation: '', date: '' }
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

  try {
    if (editing.value) {
      await service.update(form.value.id, form.value)
    } else {
      await service.create(form.value)
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    console.error('Error guardando palpación:', error)
  }
}

/* ======================
   HELPERS
====================== */
function statusLabel(value) {
  switch (value) {
    case 'pregnant': return 'Preñada'
    case 'empty': return 'Vacía'
    case 'discard': return 'Descartada'
    case 'abort': return 'Abortada'
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

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
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
  opacity: 0.5;
  animation: pulse 2s infinite ease-out;
}

@keyframes pulse {
  0% { transform: scale(0.6); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0; }
  100% { transform: scale(0.6); opacity: 0.5; }
}
</style>
