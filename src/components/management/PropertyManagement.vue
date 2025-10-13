<template>
  <LayoutApp>
    <div class="account-container">

      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner-border text-success" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <p class="mt-3 text-success">Finalizando trabajo en la propiedad</p>
      </div>

      <div class="modal fade" id="bovineModal" tabindex="-1" aria-labelledby="bovineModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content modal-green-border">
            <!-- Header -->
            <div class="modal-header">
              <h3 class="modal-title section-title-modal">
                {{ isEditing ? 'Editar Registro' : 'Nuevo Registro de Animal' }}
              </h3>
              <button @click="closeModalBovine()" class="btn-close" aria-label="close"></button>
            </div>

            <!-- Formulario -->
            <form @submit.prevent="isEditing ? updateBovine() : addBovine()">
              <div class="modal-body row">
                <!-- Serie -->
                <div class="col-md-6 form-group">
                  <label for="serie" class="form-label">
                    <i class="fas fa-barcode me-2"></i>Serie
                  </label>
                  <input v-model.trim="newBovineForm.serie" id="serie" type="text" class="form-control"
                    :class="{ 'is-invalid': duplicateSerie }" required />
                  <div v-if="duplicateSerie" class="invalid-feedback">
                    Esta serie ya existe en el registro.
                  </div>
                </div>

                <!-- RGD -->
                <div class="col-md-6 form-group">
                  <label for="rgd" class="form-label">
                    <i class="fas fa-id-card me-2"></i>RGD
                  </label>
                  <input v-model.trim="newBovineForm.rgd" id="rgd" type="text" class="form-control"
                    :class="{ 'is-invalid': duplicateRgd }" required />
                  <div v-if="duplicateRgd" class="invalid-feedback">
                    Este RGD ya existe en el registro.
                  </div>
                </div>

                <!-- Sexo -->
                <div class="col-md-6 form-group">
                  <label for="sex" class="form-label">
                    <i class="fas fa-venus-mars me-2"></i>Sexo
                  </label>
                  <select v-model="newBovineForm.sex" id="sex" class="form-control" required>
                    <option value="male">Macho</option>
                    <option value="female">Hembra</option>
                  </select>
                </div>

                <!-- Peso -->
                <div class="col-md-6 form-group">
                  <label for="weight" class="form-label">
                    <i class="fas fa-weight-hanging me-2"></i>Peso (kg)
                  </label>
                  <input v-model.number="newBovineForm.weight" id="weight" type="number" step="0.1" class="form-control"
                    required />
                </div>

                <!-- Fecha Nacimiento -->
                <div class="col-md-6 form-group">
                  <label for="birthdate" class="form-label">
                    <i class="fas fa-birthday-cake me-2"></i>Fecha de Nacimiento
                  </label>
                  <input v-model="newBovineForm.birthdate" id="birthdate" type="date" class="form-control" required />
                </div>

                <!-- Madre -->
                <div class="col-md-6 form-group">
                  <label for="mother_id" class="form-label">
                    <i class="fas fa-child me-2"></i>Madre (RGD)
                  </label>
                  <select v-model.number="newBovineForm.mother_id" id="mother_id" class="form-control">
                    <option :value="null">Ninguna</option>
                    <option v-for="bovine in filteredBovines" :key="bovine.id" :value="bovine.id">
                      {{ bovine.rgd }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Footer -->
              <div class="modal-footer d-grid">
                <button type="submit" class="btn btn-update btn-create" :disabled="!formIsValid">
                  <i :class="isEditing ? 'fas fa-save me-2' : 'fas fa-plus me-2'"></i>
                  {{ isEditing ? 'Guardar Cambios' : 'Crear Registro' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>


      <div class="account-card mb-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="account-title m-0">Protocolo de la Propiedad</h2>
          <div class="d-flex align-items-center">
            <button @click="toggleEditMode" class="btn btn-edit-property me-2">
              <i :class="isEditingProperty ? 'fas fa-times-circle' : 'fas fa-edit'"></i>
            </button>
            <button @click="openModalConfirmation" class="btn btn-close-property">
              <i class="fas fa-sign-out-alt me-2"></i>Cerrar Propiedad
            </button>
          </div>
        </div>
        <div class="info-list">
          <div v-if="!isEditingProperty">
            <div>
              <i class="fas fa-building me-2 text-primary"></i>
              <span class="font-weight-bold me-2">Nombre de la propiedad:</span>
              <span>{{ property.name }}</span>
            </div>
            <div>
              <i class="fas fa-map-marker-alt me-2 text-primary"></i>
              <span class="font-weight-bold me-2">Lugar:</span>
              <span>{{ property.place }}</span>
            </div>
            <div>
              <i class="fas fa-phone-alt me-2 text-primary"></i>
              <span class="font-weight-bold me-2">Teléfono:</span>
              <span>{{ property.phone_number }}</span>
            </div>
            <div>
              <i class="fas fa-user-tie me-2 text-primary"></i>
              <span class="font-weight-bold me-2">Dueño:</span>
              <span>{{ property.owner_name }}</span>
            </div>
          </div>
          <div v-else class="space-y-3">
            <div>
              <label for="propertyName" class="form-label">Nombre de la propiedad</label>
              <input v-model="editableProperty.name" id="propertyName" type="text" class="form-control" />
            </div>
            <div>
              <label for="propertyPlace" class="form-label">Lugar</label>
              <input v-model="editableProperty.place" id="propertyPlace" type="text" class="form-control" />
            </div>
            <div>
              <label for="propertyPhone" class="form-label">Teléfono</label>
              <input v-model="editableProperty.phone_number" id="propertyPhone" type="text" class="form-control" />
            </div>
            <div>
              <label for="propertyOwner" class="form-label">Dueño</label>
              <input v-model="editableProperty.owner_name" id="propertyOwner" type="text" class="form-control" />
            </div>
            <div class="d-grid mt-4">
              <button @click="saveChanges" :disabled="!hasChanges || !isFormValid" class="btn btn-update"
                :class="{ 'disabled-btn': !hasChanges || !isFormValid }">
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="account-card">
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <h2 class="account-title m-0">Lista de Animales</h2>
          <div class="d-flex align-items-center mt-2 mt-md-0">
            <input v-model="searchTerm" type="text" class="form-control me-2" placeholder="Buscar por Serie o RGD" />
            <button @click="openAddBovineModal" class="btn btn-primary">
              <i class="fas fa-plus me-2"></i>Nuevo
            </button>
          </div>
        </div>
        <div class="table-responsive">
          <!-- Contenedor con Scroll Vertical -->
          <div class="table-scroll-body">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th>Serie</th>
                  <th>RGD</th>
                  <th>Sexo</th>
                  <th>Peso</th>
                  <th>Nacimiento</th>
                  <th>Edad</th>
                  <th>Madre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="bovine in filteredBovines" :key="bovine.id">
                  <td>{{ bovine.serie }}</td>
                  <td>{{ bovine.rgd }}</td>
                  <td>{{ bovine.sex === 'male' ? 'Macho' : 'Hembra' }}</td>
                  <td>{{ bovine.weight }} kg</td>
                  <td>{{ bovine.birthdate }}</td>
                  <td>{{ calculateAge(bovine.birthdate) }} años</td>
                  <td>
                    <span v-if="bovine.motherId" class="text-muted">{{ bovine.motherId }}</span>
                    <span v-else class="text-muted">Ninguna</span>
                  </td>
                  <td>
                    <div class="d-flex gap-2">
                      <button @click="openEditBovineModal(bovine)" class="btn btn-sm btn-edit-property" title="Editar">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button @click="openConfirmationDeleteModal(bovine.id)" class="btn btn-sm text-danger"
                        title="Eliminar">
                        <i class="fas fa-trash-alt"></i>
                      </button>
                      <!-- Botón de Historial (Verde Naturaleza) -->
                      <button @click="viewHistory(bovine.id)" class="btn btn-sm btn-success"
                        title="Ver Historial de Procesos">
                        <i class="fas fa-history"></i>
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="!filteredBovines.length">
                  <td colspan="8" class="text-center text-muted py-4">No hay registros de animales que coincidan.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="openConfirmationPropertyModal" class="confirmation-overlay ">
      <div class="confirmation-box bg-white rounded-4 shadow-lg p-4 text-center">
        <p class="mb-4">¿Estás seguro de que quieres finalizar el trabajo en esta propiedad?</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-success" @click="closeProperty()">Sí, continuar</button>
          <button class="btn btn-outline-danger" @click="openConfirmationPropertyModal = false">Cancelar</button>
        </div>
      </div>
    </div>

    <div v-if="confirmationDeleteModal" class="confirmation-overlay ">
      <div class="confirmation-box bg-white rounded-4 shadow-lg p-4 text-center">
        <p class="mb-4">¿Estás seguro de que quieres eliminar este bovino?</p>
        <div class="d-flex justify-content-center gap-3">
          <button class="btn btn-success" @click="deleteBovine()">Sí, continuar</button>
          <button class="btn btn-outline-danger" @click="confirmationDeleteModal = false">Cancelar</button>
        </div>
      </div>
    </div>

    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080">
      <div id="liveToast" class="toast align-items-center w-100" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div id="toast-icon" class="toast-body me-2">
          </div>
          <div id="toast-message" class="toast-body flex-grow-1">
          </div>
          <button type="button" class="btn-close me-2 m-auto" insemination-bs-dismiss="toast"
            aria-label="Close"></button>
        </div>
      </div>
    </div>

  </LayoutApp>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import LayoutApp from '../LayoutApp.vue';
import { useNavigation } from '@/utils/navigation';
import { useSessionPropertyStore } from '@/store/SessionProperty';
import { Modal, Toast } from 'bootstrap';
import { BovineService } from '@/services/management/BovineService';
import { Bovine } from '@/model/management/Bovine';

const bovineService = new BovineService();
let bovineId = null;
const sessionPropertyStore = useSessionPropertyStore();
const { replaceTo } = useNavigation();

// Estado general
const isEditing = ref(false);
const isEditingProperty = ref(false);
const confirmationDeleteModal = ref(false);
const openConfirmationPropertyModal = ref(false);
const isLoading = ref(true);
const bovines = ref([]);

// Propiedad
const property = ref({
  name: 'Finca El Paraíso',
  place: 'Santa Cruz, Bolivia',
  phone_number: '591-77889900',
  owner_name: 'Juan Pérez',
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
    bovines.value = await bovineService.deleteBovine(bovineId);
    showToast('success', 'Bovino eliminado con éxito.');
  } catch (error) {
    console.error('Error al eliminar bovino:', error);
    showToast('error', 'Ocurrió un error en el servidor. Revise su conexión e inténtelo más tarde.');
  } finally {
    isLoading.value = false;
    confirmationDeleteModal.value = false;
  }
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

//funcion para filtrar bovinos
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

// === Mantiene la función original sin cambios === //
async function closeProperty() {
  console.log('Redireccionando a la ruta "select-property"');
  isLoading.value = true;
  try {
    await sessionPropertyStore.finishWork(sessionPropertyStore.getPropertyId, 1);
    replaceTo({ name: "select-property" });
  } catch (error) {
    showToast('error', 'Ocurrió un error en el servidor. Revise su conexión e inténtelo más tarde.');
  } finally {
    isLoading.value = false;
    openConfirmationPropertyModal.value = false;
  }
}
</script>


<style scoped>
/* Importamos las fuentes */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* Estilos personalizados para replicar el diseño de la cuenta */
.account-container {
  /* ¡CAMBIOS CLAVE PARA EL SCROLL DE TODA LA PLANTILLA! */
  height: 100%;
  max-height: calc(100vh - 80px);
  /* Ajusta a 100% del viewport menos la altura del header/footer si existen */
  overflow-y: auto;
  /* Habilita el scroll vertical cuando el contenido es muy largo */

  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* Fondo degradado verde suave */
  background: linear-gradient(135deg, #e6f4ea 0%, #b6e2c7 100%);
  font-family: 'Poppins', sans-serif;
}

.account-card {
  background: #fff;
  border-radius: 16px;
  /* Sombra de tarjeta verde suave */
  box-shadow: 0 4px 24px rgba(67, 160, 71, 0.15);
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 900px;
}

.account-title {
  color: #388e3c;
  text-align: center;
  margin-bottom: 2rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-label {
  display: block;
  margin-bottom: 0.5rem;
  color: #388e3c;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.form-control {
  padding: 0.8rem;
  border: 1px solid #b6e2c7;
  border-radius: 8px;
  background: #f6fff8;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-control:focus {
  border-color: #43a047;
  box-shadow: 0 0 0 0.2rem rgba(67, 160, 71, 0.25);
  outline: none;
}

/* Botón de actualizar/guardar (verde degradado) */
.btn-update {
  padding: 0.8rem;
  background: linear-gradient(90deg, #43a047 0%, #388e3c 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.2s;
}

.btn-update:hover {
  background: linear-gradient(90deg, #388e3c 0%, #43a047 100%);
  transform: translateY(-2px);
}

.disabled-btn {
  background: #a5d6a7;
  cursor: not-allowed;
}

/* Botón de editar propiedad (solo ícono verde) */
.btn-edit-property {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #43a047;
  transition: color 0.2s;
}

.btn-edit-property:hover {
  color: #388e3c;
}

/* Botón de historial (Verde Naturaleza) */
.btn-success {
  background-color: #43a047;
  border-color: #43a047;
  color: #fff;
  /* Asegura que el ícono sea blanco para contrastar */
  transition: background-color 0.2s, transform 0.2s;
}

.btn-success:hover {
  background-color: #388e3c;
  border-color: #388e3c;
  transform: translateY(-1px);
}

/* Estilo para el botón de creación grande */
.btn-create-lg {
  padding: 1rem 2.5rem;
  font-size: 1.25rem;
}

/* ---------------------------------------------------- */
/* ESTILOS DE TABLA (SCROLL Y TEMA NATURALEZA) */
/* ---------------------------------------------------- */

/* Contenedor para el scroll vertical (Tabla) */
.table-scroll-body {
  /* Fija la altura máxima para activar el scroll vertical */
  max-height: 400px;
  /* Ajusta este valor a tu gusto */
  overflow-y: auto;
  /* Asegura que el scroll horizontal siga funcionando con table-responsive */
  overflow-x: hidden;
}


.table-responsive .table {
  border-collapse: separate;
  /* Espacio vertical entre filas para el efecto de "tarjeta" */
  border-spacing: 0 0.8rem;
}

.table thead th {
  background-color: #e6f4ea;
  /* Verde muy claro para el encabezado */
  border-bottom: 2px solid #b6e2c7;
  color: #388e3c;
  /* Texto verde oscuro */
  font-weight: 600;
  padding-top: 1rem;
  /* Padding extra para mejor apariencia */
  padding-bottom: 1rem;
  position: sticky;
  /* Fija el encabezado */
  top: 0;
  z-index: 10;
}

/* Estilo de Naturaleza/Verde para el cuerpo de la tabla */
.table tbody tr {
  background-color: #f6fff8;
  /* Fondo de fila verde muy pálido */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
}

/* Filas alternadas para mejor lectura */
.table-hover>tbody>tr:nth-child(even) {
  background-color: #effcf1;
  /* Un tono un poco diferente */
}

.table tbody tr:hover {
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* ---------------------------------------------------- */
/* ESTILOS DE MODALES Y ALERTAS */
/* ---------------------------------------------------- */

/* Estilos para los modales */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 1050;
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-green-border {
  border: 3px solid #66bb6a;
  /* Borde verde claro */
}

.section-title-modal {
  color: #1b5e20;
  font-weight: 700;
  font-size: 1.5rem;
}

.modal-content {
  border-radius: 16px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-title {
  color: #388e3c;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #999;
  cursor: pointer;
}



/* Estilo para la nueva alerta de advertencia */
.alert-warning-custom {
  background-color: #fff3cd;
  border: 1px solid #ffeeba;
  color: #856404;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-close-property {
  background-color: #dc3545;
  color: #fff;
  border-radius: 8px;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  transition: background-color 0.2s;
}

.btn-close-property:hover {
  background-color: #c82333;
}

.confirmation-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.confirmation-box {
  width: 90%;
  max-width: 450px;
  padding: 2.5rem;
  border-radius: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}


.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
</style>
