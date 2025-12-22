<template>
  <div class="ultrasound-container">

    <!-- LOADER -->
    <div v-if="isLoading" class="loading-container">
      <div class="spinner-container">
        <div class="pulsing-circle"></div>
      </div>
      <p class="loading-text">{{ loadingText }}</p>
    </div>

    <!-- CONTENIDO -->
    <div v-else class="result-container">

      <!-- BOTÓN REGISTRAR (solo si NO existe) -->
      <button
        v-if="!item && !showForm"
        class="btn btn-primary mb-3"
        @click="openAddForm"
      >
        Registrar Ecografía
      </button>

      <!-- DETALLE -->
      <div v-if="item && !showForm" class="detail-card">
        <div class="detail-header">
          <h4>Ecografía</h4>
          <button class="btn btn-warning btn-sm" @click="openEditForm">
            ✏️
          </button>
        </div>

        <p>
          <strong>Vitaminas y Minerales:</strong>
          {{ item.vitamins_and_minerals ? 'Sí' : 'No' }}
        </p>

        <p><strong>Estado:</strong> {{ statusLabel(item.status) }}</p>

        <p v-if="item.protocol_details">
          <strong>Detalles del protocolo:</strong> {{ item.protocol_details }}
        </p>

        <p v-if="item.used_products_summary">
          <strong>Productos usados:</strong> {{ item.used_products_summary }}
        </p>

        <p v-if="item.work_team">
          <strong>Equipo de trabajo:</strong> {{ item.work_team }}
        </p>

        <p><strong>Fecha:</strong> {{ item.date }}</p>
      </div>

      <!-- FORMULARIO -->
      <div v-if="showForm" class="form-container mt-3 p-3 border rounded">
        <h4>{{ editing ? 'Editar Ecografía' : 'Registrar Ecografía' }}</h4>

        <form @submit.prevent="submitForm">

          <!-- CHECKBOX -->
          <div class="mb-2 form-check">
            <input
              type="checkbox"
              class="form-check-input"
              v-model="form.vitamins_and_minerals"
              id="vitamins"
            />
            <label class="form-check-label" for="vitamins">
              Vitaminas y Minerales
            </label>
          </div>

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
              <option value="implanted">Implantada</option>
              <option value="not_implanted">No implantada</option>
              <option value="discarded">Descartada</option>
            </select>
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

          <!-- TEXTOS OPCIONALES -->
          <div class="mb-2">
            <label>Detalles del Protocolo</label>
            <textarea v-model="form.protocol_details" class="form-control" />
          </div>

          <div class="mb-2">
            <label>Resumen de Productos Usados</label>
            <textarea v-model="form.used_products_summary" class="form-control" />
          </div>

          <div class="mb-2">
            <label>Equipo de Trabajo</label>
            <input v-model="form.work_team" class="form-control" />
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
import { UltrasoundService } from '@/services/management/UltrasoundService'

const service = new UltrasoundService()

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
  vitamins_and_minerals: false,
  status: '',
  protocol_details: '',
  used_products_summary: '',
  work_team: '',
  date: ''
})

const errors = ref({})

/* ======================
   VALIDACIONES EN TIEMPO REAL
====================== */
watch(form, () => {
  errors.value = {
    status: !form.value.status,
    date: !form.value.date
  }
}, { deep: true })

/* ======================
   VALIDACIÓN FINAL
====================== */
const isFormValid = computed(() => {
  return !!form.value.status && !!form.value.date
})

/* ======================
   CRUD
====================== */
async function loadItem() {
  const response = await service.get()
  item.value = response || null
}

function openAddForm() {
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

  if (editing.value) {
    await service.update(form.value.id, form.value)
  } else {
    await service.create(form.value)
  }

  await loadItem()
  showForm.value = false
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

/* ======================
   LIFECYCLE
====================== */
onMounted(async () => {
  //await loadItem()
  isLoading.value = false
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
</style>
