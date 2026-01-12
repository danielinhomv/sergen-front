<template>
  <LayoutApp>
    <div class="account-container animate__animated animate__fadeIn">

      <div v-if="isLoading || isSaving" class="loading-overlay">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-3 text-success fw-bold">Procesando catálogo...</p>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 class="main-title">Catálogo de Sementales</h1>
          <p class="text-muted mb-0">Gestión de razas y linajes genéticos</p>
        </div>
      </div>

      <div class="row g-4">
        <div class="col-lg-4 col-xl-3">
          <div class="account-card sticky-sidebar shadow-sm">
            <div class="card-header-custom mb-3">
              <h3 class="card-title-custom"><i class="fas fa-chart-pie me-2"></i>Estadísticas</h3>
            </div>

            <div class="info-display">
              <div class="info-item">
                <label>Razas Registradas</label>
                <p>{{ bulls.length }}</p>
              </div>
              <div class="info-item">
                <label>Filtro Activo</label>
                <p>{{ searchQuery ? filteredBulls.length : 'Ninguno' }}</p>
              </div>
              <div class="premium-divider my-3"></div>
              <div class="info-item">
                <i class="fas fa-info-circle text-success me-2"></i>
                <small class="text-muted">Las razas aquí listadas estarán disponibles en los registros de
                  inseminación.</small>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-8 col-xl-9">
          <div class="account-card shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <h3 class="card-title-custom m-0"><i class="fas fa-dna me-2"></i>Listado de Razas</h3>

              <div class="d-flex align-items-center gap-2">
                <div class="search-box-custom">
                  <i class="fas fa-search"></i>
                  <input v-model="searchQuery" type="text" placeholder="Buscar raza..." />
                </div>
                <button @click="openAddModal" class="btn btn-add-custom">
                  <i class="fas fa-plus me-2"></i>Nueva Raza
                </button>
              </div>
            </div>

            <div class="table-responsive custom-scroll">
              <table class="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Raza / Linaje</th>
                    <th class="text-center">Estado</th>
                    <th class="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="bull in filteredBulls" :key="bull.id">
                    <td><span class="badge-serie">#{{ bull.id }}</span></td>
                    <td>
                      <div class="d-flex align-items-center">
                        <div class="breed-avatar-circle me-3">{{ bull.name.charAt(0).toUpperCase() }}</div>
                        <span class="fw-bold text-dark">{{ bull.name }}</span>
                      </div>
                    </td>
                    <td class="text-center">
                      <span
                        class="badge bg-light text-success border border-success-subtle rounded-pill px-3">Activo</span>
                    </td>
                    <td class="text-end">
                      <div class="d-flex justify-content-end gap-2">
                        <button @click="openEditModal(bull)" class="btn-action edit" title="Editar">
                          <i class="fas fa-edit"></i>
                        </button>
                        <button @click="confirmDelete(bull)" class="btn-action delete" title="Eliminar">
                          <i class="fas fa-trash-alt"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredBulls.length === 0">
                    <td colspan="4" class="text-center py-5 text-muted">No se encontraron razas.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="bullFormModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header bg-light border-0 py-3">
              <h5 class="fw-bold m-0 text-dark">{{ editing ? 'Editar Raza' : 'Nueva Raza Genética' }}</h5>
              <button type="button" class="btn-close" @click="closeFormModal"></button>
            </div>
            <form @submit.prevent="submitForm">
              <div class="modal-body p-4">
                <div class="mb-3">
                  <label class="form-label-custom small">Nombre de la Raza</label>
                  <input v-model="form.name" type="text" class="form-control-custom"
                    :class="{ 'is-invalid': isDuplicate }" placeholder="Ej. Angus Colorado" required ref="nameInput" />
                  <div v-if="isDuplicate" class="invalid-feedback fw-bold">
                    Esta raza ya existe en el sistema.
                  </div>
                </div>
              </div>
              <div class="modal-footer border-0 p-4 pt-0">
                <button type="submit" class="btn btn-success-premium w-100 py-3 fw-bold" :disabled="!isFormValid">
                  <i class="fas fa-save me-2"></i>
                  {{ editing ? 'GUARDAR CAMBIOS' : 'REGISTRAR RAZA' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-if="showDeleteModal" class="confirmation-overlay">
        <div class="elegant-modal animate__animated animate__zoomIn">
          <div class="elegant-modal-header bg-danger-gradient">
            <div class="elegant-icon-circle text-danger"><i class="fas fa-trash-alt"></i></div>
          </div>
          <div class="elegant-modal-body">
            <h4 class="fw-bold text-dark">¿Eliminar Raza?</h4>
            <p class="text-muted">Estás por eliminar <strong>{{ bullToDelete?.name }}</strong>. Las pajillas e hijos
              asociados a esta raza podrían verse afectados.</p>
          </div>
          <div class="elegant-modal-footer">
            <button class="btn-elegant btn-danger-action" @click="executeDelete">ELIMINAR PERMANENTEMENTE</button>
            <button class="btn-elegant btn-cancel" @click="showDeleteModal = false">CANCELAR</button>
          </div>
        </div>
      </div>

      <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080">
        <div id="liveToast" class="toast align-items-center border-0 shadow-lg text-white" role="alert"
          aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div id="toast-message" class="toast-body flex-grow-1 p-3 fw-bold"></div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      </div>

    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import { BullService } from '@/services/management/BullService';
import { Bull } from '@/model/management/Bull';
import { useSessionPropertyStore } from '@/store/SessionProperty';
import { Modal, Toast } from 'bootstrap';
import LayoutApp from '../LayoutApp.vue';

const bullService = new BullService();
const sessionStore = useSessionPropertyStore();

const bulls = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const editing = ref(false);
const searchQuery = ref('');
const showDeleteModal = ref(false);
const bullToDelete = ref(null);
const nameInput = ref(null);
const form = ref({ id: null, name: '' });

let bsModal = null;

function showToast(message, type = 'success') {
  const toastEl = document.getElementById('liveToast');
  if (toastEl) {
    toastEl.className = `toast align-items-center border-0 shadow-lg text-white bg-${type === 'success' ? 'success' : 'danger'}`;
    document.getElementById('toast-message').textContent = message;
    new Toast(toastEl).show();
  }
}

const filteredBulls = computed(() => {
  return bulls.value.filter(b => b.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
});

const isDuplicate = computed(() => {
  if (!form.value.name) return false;
  return bulls.value.some(b => (editing.value && b.id === form.value.id ? false : b.name.trim().toLowerCase() === form.value.name.trim().toLowerCase()));
});

const isFormValid = computed(() => form.value.name.trim().length > 2 && !isDuplicate.value);

async function loadBulls() {
  isLoading.value = true;
  try { 
    bulls.value = await bullService.listBulls(); }
  catch (e) {
     showToast('Error al cargar datos', 'danger'); }
  finally {
     isLoading.value = false;
     }
}

function openAddModal() {
  editing.value = false;
  form.value = { id: null, name: '' };
  bsModal.show();
  nextTick(() => nameInput.value?.focus());
}

function openEditModal(bull) {
  editing.value = true;
  form.value = { id: bull.id, name: bull.name };
  bsModal.show();
}

function closeFormModal() { bsModal.hide(); }

function confirmDelete(bull) {
  bullToDelete.value = bull;
  showDeleteModal.value = true;
}

async function executeDelete() {
  isSaving.value = true;
  try {
    await bullService.deleteBull(bullToDelete.value.id);
    showToast('Raza eliminada');
    await loadBulls();
    showDeleteModal.value = false;
  } catch (e) { showToast('No se pudo eliminar', 'danger'); }
  finally { isSaving.value = false; }
}

async function submitForm() {
  isSaving.value = true;
  try {
    const bullData = new Bull({
      id: form.value.id,
      name: form.value.name.trim(),
      userId: sessionStore.getUser?.id
    });

    if (editing.value) {
      await bullService.updateBull(form.value.id, bullData);
      showToast('Actualizado con éxito');
    } else {
      await bullService.createBull(bullData);
      showToast('Registrado con éxito');
    }
    await loadBulls();
    closeFormModal();
  } catch (e) { showToast('Error al procesar', 'danger'); }
  finally { isSaving.value = false; }
}

onMounted(() => {
  loadBulls();
  bsModal = new Modal(document.getElementById('bullFormModal'));
});
</script>

<style scoped>
/* COPIANDO EXACTAMENTE TUS ESTILOS DE "PROPIEDAD" */
.account-container {
  padding: 30px;
  background: #f8fafb;
  min-height: 100vh;
}

.main-title {
  font-weight: 800;
  color: #1e293b;
  font-size: 1.8rem;
  letter-spacing: -0.5px;
}

.sticky-sidebar {
  position: sticky;
  top: 20px;
}

.account-card {
  background: white;
  border-radius: 20px;
  border: none;
  padding: 25px;
}

.card-header-custom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title-custom {
  font-size: 1.1rem;
  font-weight: 700;
  color: #334155;
}

.info-item {
  margin-bottom: 18px;
}

.info-item label {
  display: block;
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
  margin-bottom: 4px;
}

.info-item p {
  font-size: 1rem;
  color: #1e293b;
  font-weight: 600;
  margin: 0;
}

.form-label-custom {
  font-weight: 700;
  color: #475569;
  margin-bottom: 6px;
}

.form-control-custom {
  width: 100%;
  padding: 12px;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  transition: 0.3s;
}

.form-control-custom:focus {
  border-color: #10b981;
  outline: none;
  background: #fff;
}

/* BUSCADOR */
.search-box-custom {
  position: relative;
}

.search-box-custom i {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
}

.search-box-custom input {
  padding: 10px 15px 10px 40px;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  font-size: 0.9rem;
  width: 240px;
}

/* BOTONES */
.btn-add-custom {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 12px;
  font-weight: 700;
  transition: 0.3s;
}

.btn-success-premium {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.btn-action {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  border: none;
  background: #f8fafc;
  color: #64748b;
  transition: 0.2s;
}

.btn-action.edit:hover {
  background: #eff6ff;
  color: #2563eb;
}

.btn-action.delete:hover {
  background: #fff1f2;
  color: #e11d48;
}

/* ELEMENTOS BULL ESPECÍFICOS */
.badge-serie {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 700;
}

.breed-avatar-circle {
  width: 36px;
  height: 36px;
  background: #ecfdf5;
  color: #10b981;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 800;
  border: 1px solid #d1fae5;
}

.premium-divider {
  height: 1px;
  background: #f1f5f9;
}

/* MODALES ELEGANTES (CONFIRMACIÓN) */
.confirmation-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.7);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.elegant-modal {
  background: white;
  width: 100%;
  max-width: 420px;
  border-radius: 28px;
  overflow: hidden;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.3);
}

.elegant-modal-header {
  height: 90px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.bg-danger-gradient {
  background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
}

.elegant-icon-circle {
  width: 66px;
  height: 66px;
  background: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.6rem;
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  position: absolute;
  bottom: -33px;
}

.elegant-modal-body {
  padding: 50px 30px 20px;
  text-align: center;
}

.elegant-modal-footer {
  padding: 0 30px 30px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-elegant {
  width: 100%;
  padding: 14px;
  border-radius: 14px;
  border: none;
  font-weight: 700;
  transition: 0.3s;
}

.btn-danger-action {
  background: #e11d48;
  color: white;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

/* LOADING */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.85);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>