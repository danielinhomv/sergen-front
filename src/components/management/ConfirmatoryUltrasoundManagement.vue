<template>
  <div class="confirmatory-ultrasound-container">

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
        v-if="!showForm"
        class="btn btn-primary mb-3"
        @click="openAddForm"
      >
        Agregar Ecografía Confirmatoria
      </button>

      <!-- TABLA -->
      <table v-if="ultrasounds.length" class="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Observación</th>
            <th>Fecha</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ultrasounds" :key="item.id">
            <td>{{ item.id }}</td>
            <td>{{ statusLabel(item.status) }}</td>
            <td>{{ item.observation || '-' }}</td>
            <td>{{ item.date }}</td>
            <td>
              <button class="btn btn-sm btn-warning me-1" @click="openEditForm(item)">Editar</button>
              <button class="btn btn-sm btn-danger" @click="deleteUltrasound(item.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-else class="text-muted">
        No hay registros de ecografías confirmatorias.
      </div>

      <!-- FORMULARIO AGREGAR/EDITAR -->
      <div v-if="showForm" class="form-container mt-3 p-3 border rounded">
        <h4>{{ editing ? 'Editar Ecografía' : 'Agregar Ecografía' }}</h4>

        <form @submit.prevent="submitForm">

          <!-- STATUS -->
          <div class="mb-2">
            <label>Status *</label>
            <select
              v-model="form.status"
              class="form-select"
              :class="{ 'is-invalid': errors.status }"
            >
              <option value="">Seleccione...</option>
              <option value="pregnant">Preñada</option>
              <option value="empty">Vacía</option>
              <option value="refuge">Refugio</option>
              <option value="discart">Descartada</option>
            </select>
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

          <!-- OBSERVACIÓN OPCIONAL -->
          <div class="mb-2">
            <label>Observación</label>
            <textarea v-model="form.observation" class="form-control" />
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
import { ConfirmatoryUltrasoundService } from '@/services/management/ConfirmatoryUltrasoundService'

const service = new ConfirmatoryUltrasoundService()

/* =========================
   STATE
========================= */
const ultrasounds = ref([])
const isLoading = ref(true)
const loadingText = ref('Escaneando...')
const intervalId = ref(null)

const showForm = ref(false)
const editing = ref(false)
const form = ref({
  id: null,
  status: '',
  observation: '',
  date: ''
})

const errors = ref({})

/* =========================
   VALIDACIONES EN TIEMPO REAL
========================= */
watch(form, () => {
  errors.value = {
    status: !form.value.status,
    date: !form.value.date
  }
}, { deep: true })

const isFormValid = computed(() => !!form.value.status && !!form.value.date)

/* =========================
   CRUD
========================= */
async function listUltrasounds() {
  isLoading.value = true
  try {
    const response = await service.list()
    ultrasounds.value = response['confirmatory_ultrasounds'] || []
  } catch (error) {
    console.error('Error listando ecografías confirmatorias:', error)
  } finally {
    isLoading.value = false
  }
}

function openAddForm() {
  editing.value = false
  form.value = { id: null, status: '', observation: '', date: '' }
  showForm.value = true
}

function openEditForm(item) {
  editing.value = true
  form.value = { ...item }
  showForm.value = true
}

function cancelForm() {
  showForm.value = false
  form.value = {}
}

async function submitForm() {
  if (!isFormValid.value) return

  try {
    if (editing.value) {
      await service.update(form.value.id, form.value)
    } else {
      await service.create(form.value)
    }
    await listUltrasounds()
    showForm.value = false
  } catch (error) {
    console.error('Error guardando ecografía confirmatoria:', error)
  }
}

async function deleteUltrasound(id) {
  if (!confirm('¿Está seguro de eliminar esta ecografía confirmatoria?')) return
  try {
    await service.delete(id)
    await listUltrasounds()
  } catch (error) {
    console.error('Error eliminando ecografía confirmatoria:', error)
  }
}

/* =========================
   HELPERS
========================= */
function statusLabel(value) {
  switch (value) {
    case 'pregnant': return 'Preñada'
    case 'empty': return 'Vacía'
    case 'refuge': return 'Refugio'
    case 'discart': return 'Descartada'
    default: return value
  }
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
    loadingText.value = ['Escaneando...', 'Analizando datos...', 'Conectando...', 'Procesando información...'][index]
  }, 2000)
}

function stopLoadingText() {
  clearInterval(intervalId.value)
}
</script>

<style scoped>
.confirmatory-ultrasound-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  width: 100%;
  min-height: 60vh;
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

.loading-text {
  font-size: 1.2rem;
  font-weight: 500;
  color: #388e3c;
  animation: fade 2s infinite;
}

.result-container {
  background: #ffffff;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 800px;
}

.table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.table th, .table td {
  padding: 0.75rem;
  text-align: left;
  border-bottom: 1px solid #dee2e6;
}

.form-container {
  background: #f8f9fa;
}

@keyframes pulse {
  0% { transform: scale(0.6); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0; }
  100% { transform: scale(0.6); opacity: 0.5; }
}

@keyframes fade {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style>
