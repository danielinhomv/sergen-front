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
        Registrar Pre-Sincronización
      </button>

      <!-- DETALLE -->
      <div v-if="item && !showForm" class="detail-card">
        <div class="detail-header">
          <h4>Pre-Sincronización</h4>
          <button class="btn btn-warning btn-sm" @click="openEditForm">
            ✏️
          </button>
        </div>

        <p><strong>Vacuna reproductiva:</strong> {{ item.reproductive_vaccine }}</p>
        <p><strong>Sincrogest:</strong> {{ item.sincrogest_product }}</p>
        <p><strong>Antiparasitario:</strong> {{ item.antiparasitic_product }}</p>
        <p>
          <strong>Vitaminas y minerales:</strong>
          {{ item.vitamins_and_minerals ? 'Sí' : 'No' }}
        </p>
        <p><strong>Fecha aplicación:</strong> {{ item.application_date }}</p>
      </div>
      

      <!-- FORMULARIO -->
      <div v-if="showForm" class="form-container mt-3 p-3 border rounded">
        <h4>{{ editing ? 'Editar Pre-Sincronización' : 'Registrar Pre-Sincronización' }}</h4>

        <form @submit.prevent="submitForm">

          <div class="mb-2">
            <label>Vacuna Reproductiva *</label>
            <input
              v-model="form.reproductive_vaccine"
              class="form-control"
              :class="{ 'is-invalid': errors.reproductive_vaccine }"
            />
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

          <div class="mb-2">
            <label>Sincrogest *</label>
            <input
              v-model="form.sincrogest_product"
              class="form-control"
              :class="{ 'is-invalid': errors.sincrogest_product }"
            />
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

          <div class="mb-2">
            <label>Antiparasitario *</label>
            <input
              v-model="form.antiparasitic_product"
              class="form-control"
              :class="{ 'is-invalid': errors.antiparasitic_product }"
            />
            <div class="invalid-feedback">Campo obligatorio</div>
          </div>

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

          <div class="mb-2">
            <label>Fecha de aplicación *</label>
            <input
              type="date"
              v-model="form.application_date"
              class="form-control"
              :class="{ 'is-invalid': errors.application_date }"
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
import { PresynchronizationService } from '@/services/management/PresynchronizationService'

const service = new PresynchronizationService()

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
  reproductive_vaccine: '',
  sincrogest_product: '',
  antiparasitic_product: '',
  vitamins_and_minerals: true, // por defecto SI
  application_date: ''
})

const errors = ref({})

/* ======================
   VALIDACIONES EN TIEMPO REAL
====================== */
watch(form, () => {
  errors.value = {
    reproductive_vaccine: !form.value.reproductive_vaccine,
    sincrogest_product: !form.value.sincrogest_product,
    antiparasitic_product: !form.value.antiparasitic_product,
    application_date: !form.value.application_date
  }
}, { deep: true })

/* ======================
   VALIDACIÓN FINAL (CLAVE)
====================== */
const isFormValid = computed(() => {
  return (
    !!form.value.reproductive_vaccine &&
    !!form.value.sincrogest_product &&
    !!form.value.antiparasitic_product &&
    !!form.value.application_date
  )
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
