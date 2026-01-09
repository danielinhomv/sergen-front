<template>
  <div class="bull-management-container animate__animated animate__fadeIn">
    
    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
      <div>
        <h3 class="brand-title m-0">
          <i class="fas fa-dna text-success-gradient me-2"></i>Catálogo de Sementales
        </h3>
        <p class="text-muted small mb-0">Gestión de razas y genética para inseminación</p>
      </div>
      
      <div class="d-flex gap-2">
        <div v-if="!showForm && bulls.length > 0" class="search-box d-none d-lg-flex">
          <i class="fas fa-search"></i>
          <input v-model="searchQuery" type="text" placeholder="Buscar raza...">
        </div>
        
        <button v-if="!showForm" class="btn-premium btn-add" @click="openAddForm">
          <i class="fas fa-plus-circle me-2"></i>Nueva Raza
        </button>
      </div>
    </div>

    <div v-if="isLoading" class="loader-container shadow-sm border rounded-4">
      <div class="premium-spinner"></div>
      <p class="text-muted mt-3 fw-bold">Sincronizando catálogo...</p>
    </div>

    <div v-else-if="!showForm" class="content-card shadow-sm border rounded-4 overflow-hidden">
      <div class="table-responsive">
        <table class="table table-hover align-middle m-0">
          <thead class="premium-thead">
            <tr>
              <th class="ps-4 py-3">ID</th>
              <th class="py-3">RAZA / LINAJE</th>
              <th class="py-3 text-center">ESTADO</th>
              <th class="text-end pe-4 py-3">ACCIONES</th>
            </tr>
          </thead>
          <tbody class="border-0">
            <tr v-for="bull in filteredBulls" :key="bull.id" class="premium-row">
              <td class="ps-4">
                <span class="id-badge">#{{ bull.id }}</span>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <div class="breed-avatar me-3">
                    {{ bull.name.charAt(0) }}
                  </div>
                  <span class="fw-bold text-dark">{{ bull.name }}</span>
                </div>
              </td>
              <td class="text-center">
                <span class="status-pill">Activo</span>
              </td>
              <td class="text-end pe-4">
                <button class="btn-action edit" v-tooltip="'Editar'" @click="openEditForm(bull)">
                  <i class="fas fa-pen"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredBulls.length === 0" class="empty-state py-5">
        <div class="empty-icon">
          <i class="fas fa-search"></i>
        </div>
        <h5>No encontramos resultados</h5>
        <p class="text-muted">Intenta con otro nombre o registra una nueva raza.</p>
        <button v-if="bulls.length === 0" class="btn btn-success rounded-pill px-4" @click="openAddForm">
          Registrar mi primera raza
        </button>
      </div>
    </div>

    <div v-if="showForm" class="form-card-premium shadow-lg border-0 rounded-4 animate__animated animate__slideInUp">
      <div class="form-header">
        <div class="icon-circle shadow-sm">
          <i class="fas" :class="editing ? 'fa-edit' : 'fa-plus'"></i>
        </div>
        <div class="ms-3">
          <h5 class="fw-bold m-0">{{ editing ? 'Editar Raza' : 'Nueva Raza de Semental' }}</h5>
          <p class="text-muted small m-0">Complete los datos para el catálogo genético</p>
        </div>
        <button class="btn-close-custom ms-auto" @click="cancelForm">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <form @submit.prevent="submitForm" class="p-4">
        <div class="mb-4">
          <label class="form-label-premium">Nombre de la Raza / Identificador del Toro</label>
          <div class="input-group-premium" :class="{ 'error': isDuplicate, 'valid': form.name.length > 2 && !isDuplicate }">
            <i class="fas fa-certificate input-icon"></i>
            <input 
              v-model="form.name" 
              type="text" 
              placeholder="Ej: Brahman Gris, Nelore Mocho..."
              required
            >
            <i v-if="isDuplicate" class="fas fa-exclamation-triangle warning-icon text-danger"></i>
            <i v-else-if="form.name.length > 2" class="fas fa-check-circle warning-icon text-success"></i>
          </div>
          
          <div v-if="isDuplicate" class="error-msg animate__animated animate__headShake">
            <i class="fas fa-info-circle me-1"></i> Esta raza ya existe en el sistema.
          </div>
          <div v-else class="form-text-premium">
            Escriba el nombre técnico o común de la raza.
          </div>
        </div>

        <div class="d-flex justify-content-end gap-3 pt-3">
          <button type="button" class="btn-cancel" @click="cancelForm">
            Cancelar
          </button>
          <button type="submit" class="btn-submit-premium" :disabled="!isFormValid || isSaving">
            <span v-if="isSaving" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-save me-2"></i>
            {{ editing ? 'Actualizar Registro' : 'Guardar en Catálogo' }}
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
import { useSessionPropertyStore } from '@/store/SessionProperty';

const bullService = new BullService();
const sessionStore = useSessionPropertyStore();

/* --- STATE --- */
const bulls = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const showForm = ref(false);
const editing = ref(false);
const searchQuery = ref('');

const form = ref({
  id: null,
  name: ''
});

/* --- LOGIC --- */
const filteredBulls = computed(() => {
  return bulls.value.filter(bull => 
    bull.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const isDuplicate = computed(() => {
  if (!form.value.name) return false;
  return bulls.value.some(bull => {
    if (editing.value && bull.id === form.value.id) return false;
    return bull.name.trim().toLowerCase() === form.value.name.trim().toLowerCase();
  });
});

const isFormValid = computed(() => {
  return form.value.name && form.value.name.trim().length > 2 && !isDuplicate.value;
});

async function loadBulls() {
  isLoading.value = true;
  try {
    // Usamos el propertyId del store persistente
    bulls.value = await bullService.listBulls(sessionStore.getPropertyId);
  } catch (error) {
    console.error(error);
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
      origin: 'Catálogo'
    });

    if (editing.value) {
      await bullService.updateBull(form.value.id, bullData);
    } else {
      await bullService.createBull(bullData);
    }
    await loadBulls();
    showForm.value = false;
  } catch (error) {
    console.error(error);
  } finally {
    isSaving.value = false;
  }
}

onMounted(loadBulls);
</script>

<style scoped>
/* --- TYPOGRAPHY & COLORS --- */
.brand-title {
  font-weight: 800;
  color: #1e293b;
  letter-spacing: -0.5px;
}

.text-success-gradient {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* --- BUTTONS --- */
.btn-premium {
  padding: 10px 24px;
  border-radius: 12px;
  border: none;
  font-weight: 700;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
}

.btn-add {
  background: #2d4a22;
  color: white;
  box-shadow: 0 4px 12px rgba(45, 74, 34, 0.25);
}

.btn-add:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(45, 74, 34, 0.35);
}

/* --- SEARCH BOX --- */
.search-box {
  background: #f1f5f9;
  border-radius: 12px;
  padding: 0 15px;
  align-items: center;
  border: 1px solid #e2e8f0;
}

.search-box i { color: #94a3b8; }
.search-box input {
  border: none;
  background: transparent;
  padding: 10px;
  font-size: 0.9rem;
  outline: none;
  width: 200px;
}

/* --- TABLE STYLING --- */
.premium-thead {
  background: #f8fafc;
}

.premium-thead th {
  text-transform: uppercase;
  font-size: 0.7rem;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 1px;
}

.premium-row {
  transition: all 0.2s;
  border-bottom: 1px solid #f1f5f9;
}

.premium-row:hover {
  background-color: #f0fdf4 !important;
}

.id-badge {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 8px;
  font-family: 'Courier New', Courier, monospace;
  font-weight: 700;
  font-size: 0.8rem;
}

.breed-avatar {
  width: 36px;
  height: 36px;
  background: #c0da63;
  color: #1b3014;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  font-weight: 800;
}

.status-pill {
  background: #dcfce7;
  color: #166534;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
}

/* --- FORM CARD PREMIUM --- */
.form-card-premium {
  background: white;
  max-width: 600px;
  margin: 2rem auto;
}

.form-header {
  padding: 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  display: flex;
  align-items: center;
}

.icon-circle {
  width: 48px;
  height: 48px;
  background: #f0fdf4;
  color: #10b981;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.input-group-premium {
  display: flex;
  align-items: center;
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 5px 15px;
  transition: 0.3s;
}

.input-group-premium.valid { border-color: #10b981; background: #fff; }
.input-group-premium.error { border-color: #ef4444; background: #fff; }

.input-group-premium input {
  border: none;
  background: transparent;
  width: 100%;
  padding: 12px;
  outline: none;
  font-weight: 600;
}

.input-icon { color: #94a3b8; }

.btn-submit-premium {
  background: #10b981;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 12px 25px;
  border-radius: 12px;
  font-weight: 700;
}

/* --- LOADER --- */
.loader-container {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: white;
}

.premium-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #10b981;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  color: #e2e8f0;
  margin-bottom: 1rem;
}

.btn-action {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  border: none;
  transition: 0.2s;
  background: #f1f5f9;
  color: #64748b;
}

.btn-action.edit:hover {
  background: #fef3c7;
  color: #d97706;
}
</style>