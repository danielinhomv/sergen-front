<template>
<LayoutApp>
<div class="account-container">
<div v-if="showAddBovineModal" class="modal-overlay">
<div class="modal-dialog">
<div class="modal-header">
<h3 class="modal-title">Nuevo Registro de Animal</h3>
<button @click="showAddBovineModal = false" class="close-btn">
<i class="fas fa-times"></i>
</button>
</div>
<form @submit.prevent="addBovine">
<div class="alert-warning-custom mb-4">
<i class="fas fa-exclamation-triangle me-2"></i>
⚠️ Atención: Si ya existe un animal con la misma Serie o RGD, su registro anterior será reemplazado
por este nuevo.
</div>
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
<input v-model.number="newBovineForm.weight" id="weight" type="number" step="0.1" class="form-control"
required />
</div>
<div class="col-md-6 form-group">
<label for="birthdate" class="form-label"><i class="fas fa-birthday-cake me-2"></i>Fecha de
Nacimiento</label>
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
<button type="submit" class="btn btn-update btn-create">
<i class="fas fa-plus me-2"></i>Crear Registro
</button>
</div>
</form>
</div>
</div>

  <div class="account-card mb-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="account-title m-0">Protocolo de la Propiedad</h2>
      <div class="d-flex align-items-center">
        <button @click="toggleEditMode" class="btn btn-edit-property me-2">
          <i :class="isEditing ? 'fas fa-times-circle' : 'fas fa-edit'"></i>
        </button>
        <button @click="closeProperty" class="btn btn-close-property">
          <i class="fas fa-sign-out-alt me-2"></i>Cerrar Propiedad
        </button>
      </div>
    </div>

    <div class="info-list">
      <div v-if="!isEditing">
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
          <button
            @click="saveChanges"
            :disabled="!hasChanges || !isFormValid"
            class="btn btn-update"
            :class="{ 'disabled-btn': !hasChanges || !isFormValid }"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  </div>

  <div class="account-card">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="account-title m-0">Lista de Animales</h2>
      <div class="d-flex align-items-center">

        <button @click="openAddBovineModal" class="btn btn-primary me-2">

          <i class="fas fa-plus me-2"></i>Nuevo Registro

        </button>


      </div>
    </div>

    <div class="table-responsive">
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
          </tr>
        </thead>
        <tbody>
          <tr v-for="bovine in paginatedBovines" :key="bovine.id">
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
          </tr>
          <tr v-if="!paginatedBovines.length">
            <td colspan="7" class="text-center text-muted py-4">No hay registros de animales en esta página.</td>
          </tr>
        </tbody>
      </table>
    </div>

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
import LayoutApp from '../LayoutApp.vue';
import { useNavigation } from '@/utils/navigation';

// Data Mock
const initialProperty = {
name: 'Finca El Paraíso',
place: 'Santa Cruz, Bolivia',
phone_number: '591-77889900',
owner_name: 'Juan Pérez',
};

const { replaceTo } = useNavigation();

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
const editableProperty = ref({ ...initialProperty });
const isEditing = ref(false);

const hasChanges = computed(() => {
return editableProperty.value.name !== property.value.name ||
editableProperty.value.place !== property.value.place ||
editableProperty.value.phone_number !== property.value.phone_number ||
editableProperty.value.owner_name !== property.value.owner_name;
});

const isFormValid = computed(() => {
return editableProperty.value.name && editableProperty.value.place && editableProperty.value.phone_number && editableProperty.value.owner_name;
});

function toggleEditMode() {
isEditing.value = !isEditing.value;
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

// Estado de los Animales
const bovines = ref(mockBovines.value);

// Estado de paginación
const currentPage = ref(1);
const pageSize = 5;

// Estado del Modal
const showAddBovineModal = ref(false);
const newBovineForm = ref({
serie: '',
rgd: '',
sex: 'male',
weight: null,
birthdate: '',
mother_id: null,
});

function closeProperty() {
console.log('Redireccionando a la ruta "select-property"');
replaceTo({ name: "select-property'" })

}

// Lógica de la tabla de animales
const totalPages = computed(() => {
return Math.ceil(bovines.value.length / pageSize);
});

const paginatedBovines = computed(() => {
const start = (currentPage.value - 1) * pageSize;
const end = start + pageSize;
return bovines.value.slice(start, end);
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

const femaleBovines = computed(() => {
return bovines.value.filter(b => b.sex === 'female');
});
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

.disabled-btn {
background: #a5d6a7;
cursor: not-allowed;
}

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

/* Estilo para el botón de creación grande */
.btn-create-lg {
padding: 1rem 2.5rem;
font-size: 1.25rem;
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
width: 90%;
/* Ajuste para móviles /
max-width: 700px;
/ Incrementado para acomodar 2 columnas */
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
</style>