<template>
  <LayoutApp>
    <div class="account-container">

      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner-border text-success" role="status"></div>
        <p class="mt-3 text-success fw-bold">Procesando...</p>
      </div>

      <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1 class="main-title">Gestión de Propiedad</h1>
          <p class="text-muted mb-0">Control de existencias y protocolos reproductivos</p>
        </div>
        <button @click="openModalConfirmation" class="btn btn-finish-work shadow-sm">
          <i class="fas fa-door-open me-2"></i>Finalizar Trabajo
        </button>
      </div>

      <div class="row g-4">
        <div class="col-lg-4 col-xl-3">
          <div class="account-card sticky-sidebar shadow-sm">
            <div class="card-header-custom mb-3">
              <h3 class="card-title-custom"><i class="fas fa-info-circle me-2"></i>Datos Generales</h3>
              <button @click="toggleEditMode" class="btn-edit-circle" :class="{ 'active': isEditingProperty }">
                <i :class="isEditingProperty ? 'fas fa-times' : 'fas fa-pen'"></i>
              </button>
            </div>

            <div v-if="!isEditingProperty" class="info-display animate__animated animate__fadeIn">
              <div class="info-item">
                <label>Propiedad</label>
                <p>{{ property.name }}</p>
              </div>
              <div class="info-item">
                <label>Lugar</label>
                <p>{{ property.place }}</p>
              </div>
              <div class="info-item">
                <label>Teléfono</label>
                <p>{{ property.phone_number }}</p>
              </div>
              <div class="info-item">
                <label>Dueño</label>
                <p>{{ property.owner_name }}</p>
              </div>
            </div>

            <div v-else class="info-form animate__animated animate__fadeIn">
              <div class="mb-3">
                <label class="form-label-custom">Nombre</label>
                <input v-model="editableProperty.name" type="text" class="form-control-custom" />
              </div>
              <div class="mb-3">
                <label class="form-label-custom">Lugar</label>
                <input v-model="editableProperty.place" type="text" class="form-control-custom" />
              </div>
              <div class="mb-3">
                <label class="form-label-custom">Teléfono</label>
                <input v-model="editableProperty.phone_number" type="text" class="form-control-custom" />
              </div>
              <div class="mb-3">
                <label class="form-label-custom">Dueño</label>
                <input v-model="editableProperty.owner_name" type="text" class="form-control-custom" />
              </div>
              <button @click="saveChanges" :disabled="!hasChanges || !isFormValid" class="btn btn-save-property w-100">
                <i class="fas fa-save me-2"></i>Guardar
              </button>
            </div>
          </div>
        </div>

        <div class="col-lg-8 col-xl-9">
          <div class="account-card shadow-sm">
            <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <h3 class="card-title-custom m-0"><i class="fas fa-cow me-2"></i>Lista de Animales</h3>
              <div class="d-flex align-items-center gap-2">
                <div class="search-box-custom">
                  <i class="fas fa-search"></i>
                  <input v-model="searchTerm" type="text" placeholder="Buscar RGD o Serie..." />
                </div>
                <button @click="exportBovineListToPdf" class="btn btn-pdf-custom" title="Exportar PDF">
                  <i class="fas fa-file-pdf"></i>
                </button>
                <button @click="openAddBovineModal" class="btn btn-add-custom">
                  <i class="fas fa-plus me-2"></i>Nuevo
                </button>
              </div>
            </div>

            <div class="table-responsive custom-scroll">
              <table class="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Serie</th>
                    <th>RGD</th>
                    <th>Sexo</th>
                    <th>Peso</th>
                    <th>Nacimiento</th>
                    <th>Edad</th>
                    <th class="text-end">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="bovine in filteredBovines" :key="bovine.id">
                    <td><span class="badge-serie">{{ bovine.serie }}</span></td>
                    <td class="fw-bold text-success">{{ bovine.rgd }}</td>
                    <td>
                      <i :class="bovine.sex === 'male' ? 'fas fa-mars text-primary' : 'fas fa-venus text-danger'"></i>
                      {{ bovine.sex === 'male' ? ' Macho' : ' Hembra' }}
                    </td>
                    <td>{{ bovine.weight }} kg</td>
                    <td>{{ bovine.birthdate }}</td>
                    <td>{{ calculateAge(bovine.birthdate) }} años</td>
                    <td class="text-end">
                      <div class="d-flex justify-content-end gap-2">
                        <button @click="openEditBovineModal(bovine)" class="btn-action edit"><i
                            class="fas fa-edit"></i></button>
                        <button @click="viewHistory(bovine.id, bovine.rgd)" class="btn-action history"><i
                            class="fas fa-history"></i></button>
                        <button @click="openConfirmationDeleteModal(bovine.id)" class="btn-action delete"><i
                            class="fas fa-trash-alt"></i></button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="modal fade" id="bovineModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header bg-light border-0 py-3">
              <h5 class="fw-bold m-0 text-dark">{{ isEditing ? 'Editar Registro' : 'Nuevo Registro de Animal' }}</h5>
              <button @click="closeModalBovine" class="btn-close" type="button"></button>
            </div>
            <form @submit.prevent="isEditing ? updateBovine() : addBovine()">
              <div class="modal-body row g-3 p-4">
                <div class="col-md-6">
                  <label class="form-label-custom small">Serie</label>
                  <input v-model.trim="newBovineForm.serie" type="text" class="form-control-custom"
                    :class="{ 'is-invalid': duplicateSerie }" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label-custom small">RGD</label>
                  <input v-model.trim="newBovineForm.rgd" type="text" class="form-control-custom"
                    :class="{ 'is-invalid': duplicateRgd }" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label-custom small">Sexo</label>
                  <select v-model="newBovineForm.sex" class="form-control-custom" required>
                    <option value="male">Macho</option>
                    <option value="female">Hembra</option>
                  </select>
                </div>
                <div class="col-md-6">
                  <label class="form-label-custom small">Peso (kg)</label>
                  <input v-model.number="newBovineForm.weight" type="number" step="0.1" class="form-control-custom"
                    required />
                </div>
                <div class="col-md-6">
                  <label class="form-label-custom small">Fecha Nacimiento</label>
                  <input v-model="newBovineForm.birthdate" type="date" class="form-control-custom" required />
                </div>
                <div class="col-md-6">
                  <label class="form-label-custom small">Madre (RGD)</label>
                  <select v-model.number="newBovineForm.mother_id" class="form-control-custom">
                    <option :value="null">Ninguna</option>
                    <option v-for="b in bovines" :key="b.id" :value="b.id">{{ b.rgd }}</option>
                  </select>
                </div>
              </div>
              <div class="modal-footer border-0 p-4 pt-0">
                <button type="submit" class="btn btn-success-premium w-100 py-3 fw-bold" :disabled="!formIsValid">
                  <i :class="isEditing ? 'fas fa-save me-2' : 'fas fa-plus me-2'"></i>
                  {{ isEditing ? 'GUARDAR CAMBIOS' : 'CREAR REGISTRO' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-if="openConfirmationPropertyModal" class="confirmation-overlay">
        <div class="elegant-modal animate__animated animate__zoomIn">
          <div class="elegant-modal-header bg-warning-gradient">
            <div class="elegant-icon-circle"><i class="fas fa-door-open"></i></div>
          </div>
          <div class="elegant-modal-body">
            <h4 class="fw-bold text-dark">¿Finalizar Trabajo?</h4>
            <p class="text-muted">Estás por cerrar la sesión en <strong>{{ property.name }}</strong>. Los cambios
              actuales ya han sido guardados.</p>
          </div>
          <div class="elegant-modal-footer">
            <button class="btn-elegant btn-confirm" @click="closeProperty">SÍ, FINALIZAR JORNADA</button>
            <button class="btn-elegant btn-cancel" @click="openConfirmationPropertyModal = false">CANCELAR</button>
          </div>
        </div>
      </div>

      <div v-if="confirmationDeleteModal" class="confirmation-overlay">
        <div class="elegant-modal animate__animated animate__zoomIn">
          <div class="elegant-modal-header bg-danger-gradient">
            <div class="elegant-icon-circle text-danger"><i class="fas fa-trash-alt"></i></div>
          </div>
          <div class="elegant-modal-body">
            <h4 class="fw-bold text-dark">¿Eliminar Animal?</h4>
            <p class="text-muted">Esta acción es irreversible y borrará todo el historial asociado al bovino.</p>
          </div>
          <div class="elegant-modal-footer">
            <button class="btn-elegant btn-danger-action" @click="deleteBovine">ELIMINAR PERMANENTEMENTE</button>
            <button class="btn-elegant btn-cancel" @click="confirmationDeleteModal = false">CANCELAR</button>
          </div>
        </div>
      </div>

      <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080">
        <div id="liveToast" class="toast align-items-center border-0 shadow-lg text-white" role="alert"
          aria-live="assertive" aria-atomic="true">
          <div class="d-flex">
            <div id="toast-icon" class="toast-body p-3"></div>
            <div id="toast-message" class="toast-body flex-grow-1 p-3 fw-bold"></div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
          </div>
        </div>
      </div>

    </div>
  </LayoutApp>
</template>

<style scoped>
/* --- CONTENEDOR Y LAYOUT --- */
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

/* --- CARDS --- */
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

/* --- INFO DISPLAY --- */
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

/* --- FORMULARIOS --- */
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
  border-color: #48bb78;
  outline: none;
  background: #fff;
}

/* --- BUSCADOR --- */
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

/* --- BOTONES --- */
.btn-finish-work {
  background: #fff1f2;
  color: #e11d48;
  border: 2px solid #fecdd3;
  padding: 10px 20px;
  border-radius: 14px;
  font-weight: 700;
  transition: 0.3s;
}

.btn-finish-work:hover {
  background: #e11d48;
  color: white;
}

.btn-add-custom {
  background: #10b981;
  color: white;
  border: none;
  padding: 10px 22px;
  border-radius: 12px;
  font-weight: 700;
  transition: 0.3s;
}

.btn-pdf-custom {
  background: #eff6ff;
  color: #2563eb;
  border: none;
  width: 45px;
  height: 45px;
  border-radius: 12px;
}

.btn-edit-circle {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
}

.btn-edit-circle.active {
  background: #64748b;
  color: white;
}

.btn-success-premium {
  background: #10b981;
  color: white;
  border: none;
  border-radius: 14px;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

/* --- ACCIONES TABLA --- */
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

.btn-action.history:hover {
  background: #ecfdf5;
  color: #10b981;
}

.btn-action.delete:hover {
  background: #fff1f2;
  color: #e11d48;
}

.badge-serie {
  background: #f1f5f9;
  color: #475569;
  padding: 4px 10px;
  border-radius: 8px;
  font-weight: 700;
  font-family: monospace;
}

/* --- MODALES ELEGANTES --- */
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

.bg-warning-gradient {
  background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
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
  color: #f59e0b;
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
  font-size: 0.85rem;
  transition: 0.3s;
}

.btn-confirm {
  background: #1e293b;
  color: white;
}

.btn-danger-action {
  background: #e11d48;
  color: white;
}

.btn-cancel {
  background: #f1f5f9;
  color: #64748b;
}

/* --- UTILS --- */
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

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import LayoutApp from '../LayoutApp.vue';
import { useNavigation } from '@/utils/navigation';
import { useRouter } from 'vue-router';
import { useSessionPropertyStore } from '@/store/SessionProperty';
import { Modal, Toast } from 'bootstrap';
import { BovineService } from '@/services/management/BovineService';
import { BovineReportService } from '@/services/report/BovineReportService'; // Importado para el PDF
import { Bovine } from '@/model/management/Bovine';

// Importaciones para PDF
import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';

const bovineService = new BovineService();
let bovineId = null;
const sessionPropertyStore = useSessionPropertyStore();
const { replaceTo } = useNavigation();
const router = useRouter();
// Estado general
const isEditing = ref(false);
const isEditingProperty = ref(false);
const confirmationDeleteModal = ref(false);
const openConfirmationPropertyModal = ref(false);
const isLoading = ref(true);
const bovines = ref([]);
// ESTADO NUEVO PARA EL HISTORIAL COMPLETO
const fullBovinesHistory = ref(null);

// Propiedad
const property = ref({
  name: sessionPropertyStore.getName,
  place: sessionPropertyStore.getPlace,
  phone_number: sessionPropertyStore.getPhone,
  owner_name: sessionPropertyStore.getOwner,
});
const editableProperty = ref({ ...property.value });

//validaciones de campos duplicados
const duplicateSerie = ref(false);
const duplicateRgd = ref(false);

const searchTerm = ref('');
const debouncedSearch = ref('');

const updateDebouncedSearch = debounce((val) => {
  debouncedSearch.value = val.trim().toLowerCase();
}, 300);

const hasChanges = computed(() => {
  return editableProperty.value.name !== property.value.name ||
    editableProperty.value.place !== property.value.place ||
    editableProperty.value.phone_number !== property.value.phone_number ||
    editableProperty.value.owner_name !== property.value.owner_name;
});

const isFormValid = computed(() => {
  return editableProperty.value.name &&
    editableProperty.value.place &&
    editableProperty.value.phone_number &&
    editableProperty.value.owner_name;
});

// === CARGA INICIAL === //
onMounted(() => {
  fetchBovines();
});

// Utilidad simple para debounce
function debounce(fn, delay = 300) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => fn(...args), delay);
  };
}


function toggleEditMode() {
  isEditingProperty.value = !isEditingProperty.value;
  if (isEditing.value) {
    editableProperty.value = { ...property.value };
  }
}

function saveChanges() {
  if (hasChanges.value && isFormValid.value) {
    property.value = { ...editableProperty.value };
    isEditing.value = false;
    console.log('Cambios guardados:', property.value);
  }
}

// === FUNCIONES DE BOVINOS === //

const newBovineForm = ref({
  serie: '',
  rgd: '',
  sex: 'male',
  weight: null,
  birthdate: '',
  mother_id: null,
  property_id: sessionPropertyStore.getPropertyId,

});

//Validación dinámica local
watch(
  () => newBovineForm.value.serie,
  (newVal) => {
    if (!newVal) {
      duplicateSerie.value = false;
      return;
    }
    duplicateSerie.value = bovines.value.some(
      (b) =>
        b.serie?.toLowerCase() === newVal.toLowerCase() &&
        (!isEditing.value || b.id !== newBovineForm.value.id)
    );
  }
);

watch(
  () => newBovineForm.value.rgd,
  (newVal) => {
    if (!newVal) {
      duplicateRgd.value = false;
      return;
    }
    duplicateRgd.value = bovines.value.some(
      (b) =>
        b.rgd?.toLowerCase() === newVal.toLowerCase() &&
        (!isEditing.value || b.id !== newBovineForm.value.id)
    );
  }
);

//busqueda cada vez que cambia searchTerm
watch(searchTerm, (newVal) => {
  updateDebouncedSearch(newVal);
});

// --- Computed para habilitar/deshabilitar el botón de guardar o crear
const formIsValid = computed(() => {
  const f = newBovineForm.value;
  return (
    f.serie &&
    f.rgd &&
    f.sex &&
    f.weight &&
    f.birthdate &&
    !duplicateSerie.value &&
    !duplicateRgd.value
  );
});

async function fetchBovines() {
  try {
    isLoading.value = true;
    bovines.value = await bovineService.listBovines(sessionPropertyStore.getPropertyId);
  } catch (error) {
    console.error('Error al cargar los bovinos:', error);
    showToast('error', 'Ocurrió un error en el servidor. Revise su conexión e inténtelo más tarde.');
  } finally {
    isLoading.value = false;
  }
}

async function addBovine() {
  try {
    const newBovine = new Bovine({
      motherId: newBovineForm.value.mother_id,
      serie: newBovineForm.value.serie,
      rgd: newBovineForm.value.rgd,
      sex: newBovineForm.value.sex,
      weight: newBovineForm.value.weight,
      birthdate: newBovineForm.value.birthdate,
      propertyId: sessionPropertyStore.getPropertyId,
    });

    isLoading.value = true;
    bovines.value = await bovineService.createBovine(newBovine);
    showToast('success', 'Bovino registrado con éxito.');
    closeModalBovine();
  } catch (error) {
    console.error('Error al crear bovino:', error);
    showToast('error', 'Ocurrió un error en el servidor. Revise su conexión e inténtelo más tarde.');
  } finally {
    isLoading.value = false;
  }
}

async function updateBovine() {
  try {
    const updatedBovine = new Bovine({
      id: newBovineForm.value.id,
      motherId: newBovineForm.value.mother_id,
      serie: newBovineForm.value.serie,
      rgd: newBovineForm.value.rgd,
      sex: newBovineForm.value.sex,
      weight: newBovineForm.value.weight,
      birthdate: newBovineForm.value.birthdate,
      propertyId: sessionPropertyStore.getPropertyId,
    });
    console.log(updateBovine);
    isLoading.value = true;
    bovines.value = await bovineService.editBovine(updatedBovine);
    showToast('success', 'Bovino actualizado con éxito.');
    closeModalBovine();
  } catch (error) {
    console.error('Error al actualizar bovino:', error);
    showToast('error', 'Ocurrió un error en el servidor. Revise su conexión e inténtelo más tarde.');
  } finally {
    isLoading.value = false;
  }
}

async function deleteBovine() {
  try {
    isLoading.value = true;
    bovines.value = await bovineService.deleteBovine(bovineId, sessionPropertyStore.getPropertyId);
    showToast('success', 'Bovino eliminado con éxito.');
  } catch (error) {
    console.error('Error al eliminar bovino:', error);
    showToast('error', 'Ocurrió un error en el servidor. Revise su conexión e inténtelo más tarde.');
  } finally {
    isLoading.value = false;
    confirmationDeleteModal.value = false;
  }
}

function viewHistory(bovineId, bovineRgd) {
  router.push({ name: 'historial-bovine-report', query: { id: bovineId, rgd: bovineRgd } });
}

// === MODALES === //
function openModalConfirmation() {
  openConfirmationPropertyModal.value = true;
}

function openConfirmationDeleteModal(id) {
  confirmationDeleteModal.value = true;
  bovineId = id;
  console.log("id del bovino a eliminar:" + id);
}

function openAddBovineModal() {
  resetNewBovineForm();
  isEditing.value = false;
  const modal = new Modal(document.getElementById('bovineModal'));
  modal.show();
}

function openEditBovineModal(bovine) {
  isEditing.value = true;
  console.log(bovine);
  newBovineForm.value = {
    id: bovine.id,
    serie: bovine.serie,
    rgd: bovine.rgd,
    sex: bovine.sex,
    weight: bovine.weight,
    birthdate: bovine.birthdate,
    mother_id: search(bovine.motherId) //aqui motherId es en realidad el rgd recibido desde el backend
  };
  console.log(newBovineForm);
  const modal = new Modal(document.getElementById('bovineModal'));
  modal.show();
}

function search(rgd) {
  if (!rgd) {
    return null;
  }
  const bovine = bovines.value.find(b => b.rgd?.toLowerCase() === rgd.toLowerCase());
  return bovine ? bovine.id : null;
}

function closeModalBovine() {
  const modalElement = document.getElementById('bovineModal');
  const modalInstance = Modal.getInstance(modalElement);
  modalInstance.hide();
}

function resetNewBovineForm() {
  newBovineForm.value = {
    serie: '',
    rgd: '',
    sex: 'male',
    weight: null,
    birthdate: '',
    mother_id: null,
    property_id: sessionPropertyStore.getPropertyId,
  };
}

//funciones auxiliares
function calculateAge(birthdate) {
  const birth = new Date(birthdate);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

const filteredBovines = computed(() => {
  if (!debouncedSearch.value) return bovines.value;
  return bovines.value.filter(
    (b) =>
      b.serie?.toLowerCase().includes(debouncedSearch.value) ||
      b.rgd?.toLowerCase().includes(debouncedSearch.value)
  );
});

function showToast(type, message) {
  const toastEl = document.getElementById('liveToast');
  const toastMessage = document.getElementById('toast-message');
  const toastIcon = document.getElementById('toast-icon');

  toastEl.classList.remove('text-bg-success', 'text-bg-danger', 'text-bg-warning');
  let iconHtml = '';

  if (type === 'success') {
    toastEl.classList.add('text-bg-success');
    iconHtml = '<i class="fas fa-check-circle fs-5"></i>';
  } else if (type === 'error') {
    toastEl.classList.add('text-bg-danger');
    iconHtml = '<i class="fas fa-times-circle fs-5"></i>';
  } else if (type === 'warning') {
    toastEl.classList.add('text-bg-warning');
    iconHtml = '<i class="fas fa-exclamation-triangle fs-5"></i>';
  }

  toastMessage.textContent = message;
  toastIcon.innerHTML = iconHtml;
  const toast = Toast.getInstance(toastEl) || new Toast(toastEl, { delay: 4000 });
  toast.show();
}

async function closeProperty() {
  console.log('Redireccionando a la ruta "select-property"');
  isLoading.value = true;
  try {
    await sessionPropertyStore.finishWork(sessionPropertyStore.getPropertyId);
    replaceTo({ name: "select-property" });
  } catch (error) {
    showToast('error', 'Ocurrió un error en el servidor. Revise su conexión e inténtelo más tarde.');
  } finally {
    isLoading.value = false;
    openConfirmationPropertyModal.value = false;
  }
}

// --------------------------------------------------
// === LÓGICA DE EXPORTACIÓN DE HISTORIAL COMPLETO ===
// --------------------------------------------------

// 1. Definiciones de Tablas (replicadas del componente de historial individual)
const tableDefinitions = [
  {
    title: "1. Presincronización",
    dataKey: 'pre_sincronization',
    headers: ['ID', 'Fecha Aplicación', 'Vacuna Reprod.', 'Producto Sincrogest', 'Antiparasitario', 'Vitaminas'],
    keys: ['id', 'application_date', 'reproductive_vaccine', 'sincrogest_product', 'antiparasitic_product', 'vitamins_and_minerals']
  },
  {
    title: "2. Ecografía General",
    dataKey: 'ultrasound',
    headers: ['ID', 'Fecha', 'Estado', 'Vitaminas Aplicadas', 'Detalles Protocolo', 'Equipo'],
    keys: ['id', 'date', 'status', 'vitamins_and_minerals', 'protocol_details', 'work_team']
  },
  {
    title: "3. Retiro de Implante",
    dataKey: 'implant_retrieval',
    headers: ['ID', 'Fecha', 'Estado del Dispositivo', 'Equipo de Trabajo', 'Productos Usados'],
    keys: ['id', 'date', 'status', 'work_team', 'used_products_summary']
  },
  {
    title: "4. Inseminaciones",
    dataKey: 'inseminations',
    headers: ['ID', 'Fecha', 'Toro', 'CC', 'Calidad Celo', 'Observación', 'Notas Adicionales'],
    keys: ['id', 'date', 'bull', 'body_condition_score', 'heat_quality', 'observation', 'others']
  },
  {
    title: "5. Ecografías de Confirmación",
    dataKey: 'confirmatory_ultrasounds',
    headers: ['ID', 'Fecha', 'Estado de Gestación', 'Observación/Comentarios'],
    keys: ['id', 'date', 'status', 'observation']
  },
  {
    title: "6. Palpación General",
    dataKey: 'general_palpation',
    headers: ['ID', 'Fecha', 'Estado', 'Observación/Detalles'],
    keys: ['id', 'date', 'status', 'observation']
  },
  {
    title: "7. Partos",
    dataKey: 'births',
    headers: ['ID Parto', 'Fecha de Parto', 'Sexo Cría', 'Peso al Nacer (kg)', 'RGD Cría', 'Tipo de Parto'],
    keys: ['id', 'birthdate', 'sex', 'birth_weight', 'rgd', 'type_of_birth']
  },
];

/**
 * Función para formatear el valor de la celda. (Replicada del componente de historial)
 */
const formatValue = (item, field) => {
  const value = item[field];

  if (value === null || value === undefined || value === '') {
    return '-';
  }

  if (field === 'vitamins_and_minerals' && typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }

  // Para objetos/arrays que no son el valor principal, mostramos un resumen.
  if (typeof value === 'object' && !Array.isArray(value)) {
    // Asumiendo que 'bull' en 'inseminations' puede ser un objeto y queremos su 'rgd'
    if (field === 'bull' && value.rgd) {
      return value.rgd;
    }
    return Object.keys(value).length > 0 ? '[Datos Omitidos]' : '-';
  }

  return value;
};

/**
 * Dibuja una sección de tabla para un bovino específico. (Adaptada del componente de historial)
 */
const drawHistorySection = (doc, def, data, y) => {
  // La comprobación de página aquí es menos crítica, ya que la lógica principal
  // de salto de página se manejará al dibujar las tablas.

  // Título de la Sección
  doc.setFontSize(12); // Reducido ligeramente el tamaño
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(39, 174, 96); // Verde para secciones
  doc.text(def.title, 20, y);
  y += 4;

  if (!data || data.length === 0) {
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(150, 150, 150);
    doc.text("No se registraron datos para esta etapa.", 20, y + 3);
    y += 8;
  } else {
    // Preparar filas
    const rows = data.map(item => def.keys.map(key => formatValue(item, key)));

    // Llamada a la función autoTable
    autoTable(doc, {
      startY: y + 1,
      head: [def.headers],
      body: rows,
      theme: 'striped',
      styles: { fontSize: 7, cellPadding: 1, overflow: 'linebreak' },
      headStyles: { fillColor: [52, 152, 219], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      margin: { left: 20, right: 20 },
      // Sin didDrawPage aquí, se usa solo en la función principal para el pie de página.
    });

    // Actualizar la posición Y solo si doc.autoTable.previous existe
    if (doc.autoTable && doc.autoTable.previous) {
      y = doc.autoTable.previous.finalY + 5;
    } else {
      y += 30; // Fallback
    }
  }
  return y;
};

/**
 * Funciòn principal que llama al BovineReportService y genera el PDF.
 */
async function exportFullHistoryToPdf() {
  // Carga los datos completos del historial de la propiedad
  isLoading.value = true;
  showToast('info', 'Obteniendo historial completo de todos los bovinos... Esto puede tardar unos segundos.');

  try {
    const propertyId = sessionPropertyStore.getPropertyId;
    // LLAMADA AL SERVICIO BovineReportService
    fullBovinesHistory.value = await BovineReportService.getBovinesHistoryByProperty(propertyId);
  } catch (error) {
    console.error("Error al obtener el historial completo:", error);
    showToast('error', 'Error al cargar el historial completo desde el servidor.');
    isLoading.value = false;
    return;
  }

  const allHistory = fullBovinesHistory.value;
  const date = new Date().toLocaleDateString();

  if (!allHistory || allHistory.length === 0) {
    showToast('warning', 'No hay datos de historial reproductivo para esta propiedad.');
    isLoading.value = false;
    return;
  }

  // Filtramos la data de la API para que solo incluya los bovinos que el usuario tiene filtrados en la vista
  // Esto asegura que la exportación respete el filtro de búsqueda (`searchTerm`).
  const rgdFiltered = filteredBovines.value.map(b => b.rgd);
  const historyToExport = allHistory.filter(h => rgdFiltered.includes(h.bovine_rgd));

  if (historyToExport.length === 0) {
    showToast('warning', 'No se encontró historial reproductivo para los bovinos filtrados.');
    isLoading.value = false;
    return;
  }

  // --------------------------------------------------
  // GENERACIÓN DEL PDF
  // --------------------------------------------------

  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4'
  });
  let y = 15;

  // Título Principal del Documento
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(52, 152, 219);
  doc.text("REPORTE DE HISTORIAL REPRODUCTIVO POR PROPIEDAD", 15, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(51, 51, 51);
  doc.text(`Propiedad: ${sessionPropertyStore.getName || 'N/A'}`, 15, y);
  doc.text(`Dueño: ${sessionPropertyStore.getOwner || 'N/A'}`, 100, y);
  doc.text(`Fecha del Reporte: ${date}`, 15, y + 5);
  doc.text(`Total de Bovinos Exportados: ${historyToExport.length}`, 100, y + 5);
  y += 10;

  // Línea separadora
  doc.setDrawColor(200);
  doc.line(15, y, 280, y);
  y += 8;


  // Bucle principal para dibujar el historial de CADA BOVINO
  historyToExport.forEach((bovineHistory, index) => {

    // Si no es el primer bovino, añadir página
    if (index > 0) {
      doc.addPage();
      y = 15;
    }

    // Título del Bovino
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(51, 51, 51); // Color oscuro para el RGD
    doc.text(`Bovino RGD: ${bovineHistory.bovine_rgd}`, 15, y);
    y += 8;

    // Recorrer las secciones de historial del bovino actual
    tableDefinitions.forEach(def => {
      // Manejar la normalización de objetos únicos a arrays de 1 o 0 elementos
      let data = bovineHistory[def.dataKey];
      if (data && !Array.isArray(data)) {
        data = [data]; // Si es un objeto único (como ultrasound), lo convertimos a array.
      } else if (!data) {
        data = [];
      }

      y = drawHistorySection(doc, def, data, y);
    });

  });

  // Pie de página general que se aplica a todas las páginas (sobrescribe cualquier pie previo)
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      'Página ' + i + ' de ' + pageCount,
      doc.internal.pageSize.width - 25,
      doc.internal.pageSize.height - 5
    );
  }

  // Guardar el PDF
  doc.save(`REPORTE_HISTORIAL_PROPIEDAD_${sessionPropertyStore.getName.replace(/\s/g, '_')}_${date.replace(/\//g, '-')}.pdf`);

  showToast('success', `PDF de historial generado con éxito para ${historyToExport.length} bovinos.`);
  isLoading.value = false;
}

// Renombramos la función para enlazarla en el HTML
const exportBovineListToPdf = exportFullHistoryToPdf;

</script>
