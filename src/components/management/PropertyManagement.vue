<template>
  <LayoutApp>
    <div class="account-container">
      <!-- Componente Modal para confirmaciones y mensajes -->
      <div v-if="showConfirmModal" class="modal-overlay">
        <div class="modal-dialog">
          <h3 class="modal-title">{{ modalTitle }}</h3>
          <p class="modal-message">{{ modalMessage }}</p>
          <div class="modal-footer">
            <button @click="showConfirmModal = false" class="btn btn-secondary">
              Cancelar
            </button>
            <button @click="modalAction" class="btn btn-primary" :class="{ 'btn-danger': modalTitle.includes('Eliminación') }">
              Confirmar
            </button>
          </div>
        </div>
      </div>

      <!-- Modal para crear un nuevo animal -->
      <div v-if="showAddBovineModal" class="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Nuevo Registro de Animal</h3>
            <button @click="showAddBovineModal = false" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="addBovine">
            <div class="modal-body row">
              <div class="col-md-6 form-group">
                <label for="serie" class="form-label"><i class="fas fa-barcode me-2"></i>Serie</label>
                <input v-model="newBovineForm.serie" id="serie" type="text" class="form-control" required />
              </div>
              <div class="col-md-6 form-group">
                <label for="rgd" class="form-label"><i class="fas fa-id-card me-2"></i>RGD</label>
                <input v-model="newBovineForm.rgd" id="rgd" type="text" class="form-control" required />
              </div>
              <div class="col-md-6 form-group">
                <label for="sex" class="form-label"><i class="fas fa-venus-mars me-2"></i>Sexo</label>
                <select v-model="newBovineForm.sex" id="sex" class="form-control" required>
                  <option value="male">Macho</option>
                  <option value="female">Hembra</option>
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label for="weight" class="form-label"><i class="fas fa-weight-hanging me-2"></i>Peso (kg)</label>
                <input v-model.number="newBovineForm.weight" id="weight" type="number" step="0.1" class="form-control" required />
              </div>
              <div class="col-md-6 form-group">
                <label for="birthdate" class="form-label"><i class="fas fa-birthday-cake me-2"></i>Fecha de Nacimiento</label>
                <input v-model="newBovineForm.birthdate" id="birthdate" type="date" class="form-control" required />
              </div>
              <div class="col-md-6 form-group">
                <label for="mother_id" class="form-label"><i class="fas fa-child me-2"></i>Madre (RGD)</label>
                <select v-model.number="newBovineForm.mother_id" id="mother_id" class="form-control">
                  <option :value="null">Ninguna</option>
                  <option v-for="bovine in femaleBovines" :key="bovine.id" :value="bovine.id">{{ bovine.rgd }}</option>
                </select>
              </div>
            </div>
            <div class="modal-footer d-grid">
              <button type="submit" class="btn btn-update">
                <i class="fas fa-plus me-2"></i>Crear Registro
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Modal para editar un animal -->
      <div v-if="showEditBovineModal" class="modal-overlay">
        <div class="modal-dialog">
          <div class="modal-header">
            <h3 class="modal-title">Editar Animal</h3>
            <button @click="showEditBovineModal = false" class="close-btn">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <form @submit.prevent="saveBovineChanges">
            <div class="modal-body row">
              <div class="col-md-6 form-group">
                <label for="edit-serie" class="form-label"><i class="fas fa-barcode me-2"></i>Serie</label>
                <input v-model="editedBovine.serie" id="edit-serie" type="text" class="form-control" required />
              </div>
              <div class="col-md-6 form-group">
                <label for="edit-rgd" class="form-label"><i class="fas fa-id-card me-2"></i>RGD</label>
                <input v-model="editedBovine.rgd" id="edit-rgd" type="text" class="form-control" required />
              </div>
              <div class="col-md-6 form-group">
                <label for="edit-sex" class="form-label"><i class="fas fa-venus-mars me-2"></i>Sexo</label>
                <select v-model="editedBovine.sex" id="edit-sex" class="form-control" required>
                  <option value="male">Macho</option>
                  <option value="female">Hembra</option>
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label for="edit-weight" class="form-label"><i class="fas fa-weight-hanging me-2"></i>Peso (kg)</label>
                <input v-model.number="editedBovine.weight" id="edit-weight" type="number" step="0.1" class="form-control" required />
              </div>
              <div class="col-md-6 form-group">
                <label for="edit-birthdate" class="form-label"><i class="fas fa-birthday-cake me-2"></i>Fecha de Nacimiento</label>
                <input v-model="editedBovine.birthdate" id="edit-birthdate" type="date" class="form-control" required />
              </div>
              <div class="col-md-6 form-group">
                <label for="edit-mother_id" class="form-label"><i class="fas fa-child me-2"></i>Madre (RGD)</label>
                <select v-model.number="editedBovine.mother_id" id="edit-mother_id" class="form-control">
                  <option :value="null">Ninguna</option>
                  <option v-for="bovine in femaleBovines" :key="bovine.id" :value="bovine.id">{{ bovine.rgd }}</option>
                </select>
              </div>
            </div>
            <div class="modal-footer d-grid">
              <button type="submit" class="btn btn-update" :disabled="!canSaveBovineChanges">
                <i class="fas fa-save me-2"></i>Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- Sección de la Propiedad -->
      <div class="account-card mb-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="account-title m-0">Protocolo de la Propiedad</h2>
          <div class="d-flex align-items-center">
            <button @click="toggleEditProperty" class="btn btn-link me-2">
              <i :class="isEditingProperty ? 'fas fa-times-circle' : 'fas fa-edit'" class="fa-lg"></i>
            </button>
            <button @click="closeProperty" class="btn btn-close-property">
              <i class="fas fa-sign-out-alt me-2"></i>Cerrar Propiedad
            </button>
          </div>
        </div>

        <!-- Vista de solo lectura -->
        <div v-if="!isEditingProperty" class="info-list">
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

        <!-- Formulario de Edición -->
        <form v-else @submit.prevent="savePropertyChanges">
          <div class="form-group">
            <label class="form-label"><i class="fas fa-building me-2"></i>Nombre</label>
            <input v-model="editedProperty.name" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fas fa-map-marker-alt me-2"></i>Lugar</label>
            <input v-model="editedProperty.place" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fas fa-phone-alt me-2"></i>Teléfono</label>
            <input v-model="editedProperty.phone_number" type="text" class="form-control" />
          </div>
          <div class="form-group">
            <label class="form-label"><i class="fas fa-user-tie me-2"></i>Dueño</label>
            <input v-model="editedProperty.owner_name" type="text" class="form-control" />
          </div>
          <div class="d-grid mt-4">
            <button type="submit" class="btn btn-update" :disabled="!canSavePropertyChanges">
              <i class="fas fa-save me-2"></i>Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <!-- Sección de la Lista de Animales -->
      <div class="account-card">
        <div class="d-flex justify-content-between align-items-center mb-4">
          <h2 class="account-title m-0">Lista de Animales</h2>
          <div class="d-flex align-items-center">
            <button @click="openAddBovineModal" class="btn btn-primary me-2">
              <i class="fas fa-plus me-2"></i>Nuevo Registro
            </button>
            <button @click="openExcelModal" class="btn btn-success me-2">
              <i class="fas fa-file-excel me-2"></i>Importar Excel
            </button>
            <button @click="confirmDeleteAll" :disabled="!bovines.length" class="btn btn-danger me-2">
              <i class="fas fa-trash me-2"></i>Eliminar Todos
            </button>
            <button @click="confirmDeleteSelected" :disabled="!selectedBovines.length" class="btn btn-warning">
              <i class="fas fa-trash-alt me-2"></i>Eliminar Seleccionados
            </button>
          </div>
        </div>
        
        <!-- Nuevo campo de búsqueda -->
        <div class="form-group">
          <input v-model="searchTerm" type="text" placeholder="Buscar por Serie o RGD..." class="form-control" />
        </div>

        <!-- Tabla de Animales -->
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" @change="toggleSelectAll" :checked="isAllSelected" />
                </th>
                <th>Serie</th>
                <th>RGD</th>
                <th>Sexo</th>
                <th>Peso</th>
                <th>Nacimiento</th>
                <th>Edad</th>
                <th>Madre</th>
                <th class="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="bovine in paginatedBovines" :key="bovine.id">
                <td>
                  <input type="checkbox" v-model="selectedBovines" :value="bovine.id" />
                </td>
                <td>{{ bovine.serie }}</td>
                <td>{{ bovine.rgd }}</td>
                <td>{{ bovine.sex }}</td>
                <td>{{ bovine.weight }} kg</td>
                <td>{{ bovine.birthdate }}</td>
                <td>{{ calculateAge(bovine.birthdate) }} años</td>
                <td>
                  <span v-if="bovine.mother_id" class="text-muted">{{ getMotherRGD(bovine.mother_id) }}</span>
                  <span v-else class="text-muted">N/A</span>
                </td>
                <td class="text-center">
                  <button @click="openEditBovineModal(bovine.id)" class="btn btn-sm btn-info me-2">
                    <i class="fas fa-pen"></i>
                  </button>
                  <button @click="confirmDeleteBovine(bovine.id)" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
              <tr v-if="!paginatedBovines.length">
                <td colspan="9" class="text-center text-muted py-4">No hay registros de animales en esta página.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Controles de Paginación -->
        <nav aria-label="Paginación de registros" class="mt-4 d-flex justify-content-center">
          <ul class="pagination">
            <li class="page-item" :class="{ 'disabled': currentPage === 1 }">
              <button @click="currentPage--" class="page-link">Anterior</button>
            </li>
            <li class="page-item" v-for="page in totalPages" :key="page" :class="{ 'active': currentPage === page }">
              <button @click="currentPage = page" class="page-link">{{ page }}</button>
            </li>
            <li class="page-item" :class="{ 'disabled': currentPage === totalPages }">
              <button @click="currentPage++" class="page-link">Siguiente</button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, computed } from 'vue';
import { isEqual } from 'lodash';
import LayoutApp from '../LayoutApp.vue';

// Data Mock
const initialProperty = {
  name: 'Finca El Paraíso',
  place: 'Santa Cruz, Bolivia',
  phone_number: '591-77889900',
  owner_name: 'Juan Pérez',
};

const mockBovines = ref([
  { id: 1, serie: 'A123', rgd: 'S1-456', sex: 'female', weight: 450.5, birthdate: '2022-01-15', mother_id: null },
  { id: 2, serie: 'A124', rgd: 'S1-457', sex: 'female', weight: 480.0, birthdate: '2022-02-20', mother_id: 1 },
  { id: 3, serie: 'A125', rgd: 'S1-458', sex: 'male', weight: 510.3, birthdate: '2022-03-10', mother_id: 1 },
  { id: 4, serie: 'A126', rgd: 'S1-459', sex: 'female', weight: 460.1, birthdate: '2022-04-05', mother_id: 2 },
  { id: 5, serie: 'A127', rgd: 'S1-460', sex: 'male', weight: 490.5, birthdate: '2022-05-18', mother_id: 2 },
  { id: 6, serie: 'A128', rgd: 'S1-461', sex: 'female', weight: 470.0, birthdate: '2022-06-25', mother_id: 4 },
  { id: 7, serie: 'A129', rgd: 'S1-462', sex: 'male', weight: 505.3, birthdate: '2022-07-01', mother_id: 4 },
]);

// Estado de la Propiedad
const property = ref({ ...initialProperty });
const editedProperty = ref({ ...initialProperty });
const isEditingProperty = ref(false);

// Estado de los Animales
const bovines = ref(mockBovines.value);
const selectedBovines = ref([]);
const searchTerm = ref('');

// Estado de paginación
const currentPage = ref(1);
const pageSize = 5;

// Estado del Modal
const showConfirmModal = ref(false);
const showAddBovineModal = ref(false);
const showEditBovineModal = ref(false);
const newBovineForm = ref({
  serie: '',
  rgd: '',
  sex: 'male',
  weight: null,
  birthdate: '',
  mother_id: null,
});
const editedBovine = ref({});
const originalBovine = ref({});

const modalTitle = ref('');
const modalMessage = ref('');
const modalAction = ref(null);

// Lógica de la Propiedad
const hasPropertyChanges = computed(() => {
  return !isEqual(property.value, editedProperty.value);
});

const isPropertyFormValid = computed(() => {
  return Object.values(editedProperty.value).every(value => value !== '' && value !== null && value !== undefined);
});

const canSavePropertyChanges = computed(() => {
  return hasPropertyChanges.value && isPropertyFormValid.value;
});

function toggleEditProperty() {
  isEditingProperty.value = !isEditingProperty.value;
  if (!isEditingProperty.value) {
    editedProperty.value = { ...property.value };
  }
}

function savePropertyChanges() {
  if (canSavePropertyChanges.value) {
    property.value = { ...editedProperty.value };
    isEditingProperty.value = false;
    console.log('Propiedad actualizada:', property.value);
    // Lógica para enviar a la API
  }
}

function closeProperty() {
  console.log('Redireccionando a la ruta "select-property"');
  // Lógica para redirigir a una nueva página o componente
  // En un entorno real, usarías un router como Vue Router
  // router.push({ name: 'select-property' });
  // Usamos una simulación de alerta, pero en un entorno real se usaría un modal
  // con el que el usuario podría interactuar.
}

// Lógica de búsqueda y de la tabla de animales
const filteredBovines = computed(() => {
  const term = searchTerm.value.toLowerCase();
  if (!term) {
    return bovines.value;
  }
  return bovines.value.filter(bovine =>
    bovine.serie.toLowerCase().includes(term) ||
    bovine.rgd.toLowerCase().includes(term)
  );
});

const totalPages = computed(() => {
  return Math.ceil(filteredBovines.value.length / pageSize);
});

const paginatedBovines = computed(() => {
  const start = (currentPage.value - 1) * pageSize;
  const end = start + pageSize;
  return filteredBovines.value.slice(start, end);
});

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

function getMotherRGD(motherId) {
  const mother = bovines.value.find(b => b.id === motherId);
  return mother ? mother.rgd : 'Desconocida';
}

function openAddBovineModal() {
  resetNewBovineForm();
  showAddBovineModal.value = true;
}

function addBovine() {
  const newId = bovines.value.length > 0 ? Math.max(...bovines.value.map(b => b.id)) + 1 : 1;
  const newBovine = {
    ...newBovineForm.value,
    id: newId,
    weight: newBovineForm.value.weight,
  };
  bovines.value.push(newBovine);
  showAddBovineModal.value = false;
  resetNewBovineForm();
  console.log('Nuevo animal añadido:', newBovine);
}

function openEditBovineModal(id) {
  const bovineToEdit = bovines.value.find(b => b.id === id);
  if (bovineToEdit) {
    originalBovine.value = { ...bovineToEdit };
    editedBovine.value = { ...bovineToEdit };
    showEditBovineModal.value = true;
  }
}

const hasBovineChanges = computed(() => {
  return !isEqual(originalBovine.value, editedBovine.value);
});

const isBovineFormValid = computed(() => {
  return Object.values(editedBovine.value).every(value => value !== '' && value !== null && value !== undefined);
});

const canSaveBovineChanges = computed(() => {
  return hasBovineChanges.value && isBovineFormValid.value;
});

function saveBovineChanges() {
  if (canSaveBovineChanges.value) {
    const index = bovines.value.findIndex(b => b.id === editedBovine.value.id);
    if (index !== -1) {
      bovines.value[index] = { ...editedBovine.value };
      showEditBovineModal.value = false;
      console.log('Animal actualizado:', editedBovine.value);
    }
  }
}

function resetNewBovineForm() {
  newBovineForm.value = {
    serie: '',
    rgd: '',
    sex: 'male',
    weight: null,
    birthdate: '',
    mother_id: null,
  };
}

function deleteBovine(id) {
  const index = bovines.value.findIndex(b => b.id === id);
  if (index !== -1) {
    bovines.value.splice(index, 1);
    selectedBovines.value = selectedBovines.value.filter(item => item !== id);
    if (paginatedBovines.value.length === 0 && currentPage.value > 1) {
      currentPage.value--;
    }
    console.log(`Animal con ID ${id} eliminado.`);
  }
}

function deleteSelectedBovines() {
  bovines.value = bovines.value.filter(b => !selectedBovines.value.includes(b.id));
  selectedBovines.value = [];
  showConfirmModal.value = false;
  if (paginatedBovines.value.length === 0 && currentPage.value > 1) {
    currentPage.value--;
  }
  console.log('Animales seleccionados eliminados.');
}

function deleteAllBovines() {
  bovines.value = [];
  selectedBovines.value = [];
  currentPage.value = 1;
  showConfirmModal.value = false;
  console.log('Todos los animales han sido eliminados.');
}

// Lógica de Selección
const isAllSelected = computed(() => {
  return paginatedBovines.value.length > 0 && paginatedBovines.value.every(b => selectedBovines.value.includes(b.id));
});

function toggleSelectAll() {
  const paginatedIds = paginatedBovines.value.map(b => b.id);
  if (isAllSelected.value) {
    selectedBovines.value = selectedBovines.value.filter(id => !paginatedIds.includes(id));
  } else {
    const newSelected = new Set([...selectedBovines.value, ...paginatedIds]);
    selectedBovines.value = Array.from(newSelected);
  }
}

const femaleBovines = computed(() => {
  return bovines.value.filter(b => b.sex === 'female');
});

// Lógica de los Botones
function openExcelModal() {
  console.log('Abriendo modal para importar Excel...');
}

function confirmDeleteBovine(id) {
  modalTitle.value = 'Confirmar Eliminación';
  modalMessage.value = '¿Estás seguro de que quieres eliminar este registro? Esta acción es irreversible.';
  modalAction.value = () => {
    deleteBovine(id);
    showConfirmModal.value = false;
  };
  showConfirmModal.value = true;
}

function confirmDeleteSelected() {
  modalTitle.value = 'Confirmar Eliminación Masiva';
  modalMessage.value = `¿Estás seguro de que quieres eliminar los ${selectedBovines.value.length} registros seleccionados? Esta acción es irreversible.`;
  modalAction.value = deleteSelectedBovines;
  showConfirmModal.value = true;
}

function confirmDeleteAll() {
  modalTitle.value = 'Confirmar Eliminación de Todo';
  modalMessage.value = '¿Estás seguro de que quieres eliminar TODOS los registros de la lista? Esta acción es irreversible.';
  modalAction.value = deleteAllBovines;
  showConfirmModal.value = true;
}

</script>

<style scoped>
/* Importamos las fuentes */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

/* Estilos personalizados para replicar el diseño de la cuenta */
.account-container {
  min-height: 100vh;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(135deg, #e6f4ea 0%, #b6e2c7 100%);
  font-family: 'Poppins', sans-serif;
}

.account-card {
  background: #fff;
  border-radius: 16px;
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

.table-responsive .table {
  border-collapse: separate;
  border-spacing: 0 0.8rem;
}

.table thead th {
  background-color: #e6f4ea;
  border-bottom: 2px solid #b6e2c7;
  color: #388e3c;
  font-weight: 600;
}

.table tbody tr {
  background-color: #f6fff8;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease-in-out;
}

.table tbody tr:hover {
  background-color: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

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

.modal-dialog {
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
  width: 90%; /* Ajuste para móviles */
  max-width: 700px; /* Incrementado para acomodar 2 columnas */
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

.modal-message {
  color: #6c757d;
  margin-bottom: 2rem;
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
</style>
