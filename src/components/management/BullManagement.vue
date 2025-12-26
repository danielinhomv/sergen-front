<template>
  <div class="bull-management-container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4 class="text-success fw-bold m-0">
        <i class="fas fa-dna me-2"></i>Catálogo de Sementales (Razas)
      </h4>
      <button v-if="!showForm" class="btn btn-success shadow-sm fw-bold" @click="openAddForm">
        <i class="fas fa-plus me-2"></i>Registrar Raza
      </button>
    </div>

    <div v-if="isLoading" class="text-center py-5">
      <div class="spinner-border text-success" role="status"></div>
      <p class="text-muted mt-2">Cargando catálogo...</p>
    </div>

    <div v-else-if="!showForm" class="table-responsive rounded-4 shadow-sm border overflow-hidden">
      <table class="table table-hover align-middle m-0">
        <thead class="bg-light-success text-success">
          <tr>
            <th class="ps-4">ID / Identificador</th>
            <th>Raza (Semental)</th>
            <th class="text-end pe-4">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="bull in bulls" :key="bull.id" class="transition-row">
            <td class="ps-4 fw-bold text-muted">#{{ bull.id }}</td>
            <td>
              <span class="badge bg-light text-success border border-success-subtle fs-6 px-3">
                <i class="fas fa-certificate me-2"></i>{{ bull.name }}
              </span>
            </td>
            <td class="text-end pe-4">
              <button class="btn btn-outline-warning btn-sm border-0" @click="openEditForm(bull)">
                <i class="fas fa-edit me-1"></i> Editar
              </button>
            </td>
          </tr>
          <tr v-if="bulls.length === 0">
            <td colspan="3" class="text-center py-5 text-muted">No hay razas de toros registradas.</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="showForm"
      class="form-container p-4 bg-white border border-success-subtle rounded-4 shadow-sm animate__animated animate__fadeIn">
      <h5 class="text-success fw-bold mb-4">
        <i class="fas fa-file-signature me-2"></i>{{ editing ? 'Actualizar Información' : 'Registrar Nueva Raza' }}
      </h5>

      <form @submit.prevent="submitForm">
        <div class="row g-3">
          <div class="col-md-12">
            <label class="form-label fw-bold small text-uppercase">Raza del Toro / Nombre Semental *</label>
            <input v-model="form.name" type="text" class="form-control form-control-lg border-success-subtle"
              :class="{ 'is-invalid': isDuplicate || (form.name && form.name.length <= 2) }"
              placeholder="Ej: Nelore, Brahman, Angus..." required>
            <div v-if="isDuplicate" class="invalid-feedback fw-bold">
              <i class="fas fa-exclamation-circle me-1"></i> Esta raza ya se encuentra registrada en el catálogo.
            </div>
            <div v-else-if="form.name && form.name.length <= 2" class="invalid-feedback">
              El nombre es demasiado corto.
            </div>
            <div v-else class="form-text text-success">
              <i class="fas fa-check-circle me-1"></i> Nombre disponible para registro.
            </div>
          </div>
        </div>

        <div class="d-flex gap-2 mt-4">
          <button type="submit" class="btn btn-success px-4 shadow-sm fw-bold py-2"
            :disabled="!isFormValid || isSaving">
            <i class="fas fa-save me-2"></i>{{ isSaving ? 'Guardando...' : 'Confirmar Registro' }}
          </button>
          <button type="button" class="btn btn-light px-4 fw-bold" @click="cancelForm">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { BullService } from '@/services/management/BullService';
import { Bull } from '@/model/management/Bull';
import { Toast } from 'bootstrap';

const bullService = new BullService();

/* --- STATE --- */
const bulls = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showForm = ref(false);
const editing = ref(false);

const form = ref({
  id: null,
  name: ''
});

/* --- VALIDATION LOGIC --- */

// 1. Verificamos si el nombre ya existe en la lista (ignorando mayúsculas/minúsculas)
const isDuplicate = computed(() => {
  if (!form.value.name) return false;

  return bulls.value.some(bull => {
    // Si estamos editando, permitimos que el nombre coincida con el registro actual
    if (editing.value && bull.id === form.value.id) return false;

    return bull.name.trim().toLowerCase() === form.value.name.trim().toLowerCase();
  });
});

// 2. El botón solo se habilita si no está vacío, tiene más de 2 letras y NO es un duplicado
const isFormValid = computed(() => {
  return (
    form.value.name &&
    form.value.name.trim().length > 2 &&
    !isDuplicate.value
  );
});

/* --- (Resto de funciones se mantienen igual) --- */

function showToast(type, message) {
  const toastEl = document.getElementById('liveToast');
  if (!toastEl) return;
  const toastMessage = document.getElementById('toast-message');
  toastEl.className = `toast align-items-center w-100 text-white border-0 ${type === 'success' ? 'bg-success' : 'bg-danger'}`;
  toastMessage.textContent = message;
  const toast = Toast.getOrCreateInstance(toastEl);
  toast.show();
}

async function loadBulls() {
  isLoading.value = true;
  try {
    bulls.value = await bullService.listBulls(2);
  } catch (error) {
    showToast('error', 'Error al conectar con el servidor.');
  } finally {
    isLoading.value = false;
  }
}

function openAddForm() {
  editing.value = false;
  form.value = { id: null, name: '' };
  showForm.value = true;
}

function openEditForm(bull) {
  editing.value = true;
  form.value = { id: bull.id, name: bull.name };
  showForm.value = true;
}

function cancelForm() {
  showForm.value = false;
}

async function submitForm() {
  if (!isFormValid.value) return;

  isSaving.value = true;
  try {
    const bullData = new Bull({
      id: form.value.id,
      name: form.value.name.trim(),
      breed: form.value.name.trim(),
      origin: 'Registro de Inseminación'
    });

    if (editing.value) {
      await bullService.updateBull(form.value.id, bullData);
      showToast('success', 'Raza actualizada.');
    } else {
      await bullService.createBull(bullData);
      showToast('success', 'Raza registrada correctamente.');
    }
    await loadBulls();
    showForm.value = false;
  } catch (error) {
    showToast('error', 'No se pudo completar la operación.');
  } finally {
    isSaving.value = false;
  }
}

onMounted(loadBulls);
</script>

<style scoped>
.bg-light-success {
  background-color: #f0fdf4 !important;
}

.transition-row:hover {
  background-color: #f8faf9;
}

.form-control-lg {
  font-size: 1.1rem;
}

.table thead th {
  font-size: 0.75rem;
  letter-spacing: 1px;
}

/* Estilo para que el texto de duplicado sea llamativo */
.invalid-feedback {
  font-size: 0.85rem;
}
</style>