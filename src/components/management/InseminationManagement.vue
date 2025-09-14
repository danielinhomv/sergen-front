<template>
<div class="bovine-detail-container">
<!-- Contenedor de la animación de carga -->
<div v-if="isLoading" class="loading-container">
<div class="spinner-container">
<div class="pulsing-circle"></div>
</div>
<div class="text-container">
<p class="loading-text">{{ loadingText }}</p>
</div>
</div>

<!-- Contenido principal que se muestra después de la carga -->
<div v-else class="content-container">
  <div class="card-section info-section">
    <h2 class="section-title">
      Información del Bovino
      <i class="fas fa-pencil-alt edit-icon" @click="toggleEdit"></i>
    </h2>
    <div v-if="!isEditing" class="info-grid">
      <div class="info-item">
        <i class="fas fa-id-card-alt icon-info"></i>
        <span class="label">RGD:</span>
        <span class="value">{{ bovine.rgd }}</span>
      </div>
      <div class="info-item">
        <i class="fas fa-tag icon-info"></i>
        <span class="label">Serie:</span>
        <span class="value">{{ bovine.serie }}</span>
      </div>
      <div class="info-item">
        <i class="fas fa-venus-mars icon-info"></i>
        <span class="label">Sexo:</span>
        <span class="value">{{ bovine.sex === 'male' ? 'Macho' : 'Hembra' }}</span>
      </div>
      <div class="info-item">
        <i class="fas fa-weight-hanging icon-info"></i>
        <span class="label">Peso:</span>
        <span class="value">{{ bovine.weight }} kg</span>
      </div>
      <div class="info-item">
        <i class="fas fa-birthday-cake icon-info"></i>
        <span class="label">Nacimiento:</span>
        <span class="value">{{ bovine.birthdate }}</span>
      </div>
      <div class="info-item">
        <i class="fas fa-clock icon-info"></i>
        <span class="label">Edad:</span>
        <span class="value">{{ calculateAge(bovine.birthdate) }} años</span>
      </div>
      <div class="info-item">
        <i class="fas fa-child icon-info"></i>
        <span class="label">Madre:</span>
        <span class="value">{{ bovine.motherId ? 'RG-D: ' + bovine.motherId : 'N/A' }}</span>
      </div>
      <div class="info-item">
        <i class="fas fa-baby-carriage icon-info"></i>
        <span class="label">Hijo:</span>
        <span class="value">{{ bovine.childId ? 'RG-D: ' + bovine.childId : 'N/A' }}</span>
      </div>
    </div>
    <div v-else class="edit-form-container">
      <div class="form-group">
        <label for="edit-rgd" class="form-label"><i class="fas fa-id-card-alt me-2"></i>RGD</label>
        <input v-model="editableBovine.rgd" id="edit-rgd" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label for="edit-serie" class="form-label"><i class="fas fa-tag me-2"></i>Serie</label>
        <input v-model="editableBovine.serie" id="edit-serie" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label for="edit-sex" class="form-label"><i class="fas fa-venus-mars me-2"></i>Sexo</label>
        <select v-model="editableBovine.sex" id="edit-sex" class="form-control">
          <option value="male">Macho</option>
          <option value="female">Hembra</option>
        </select>
      </div>
      <div class="form-group">
        <label for="edit-weight" class="form-label"><i class="fas fa-weight-hanging me-2"></i>Peso</label>
        <input v-model.number="editableBovine.weight" id="edit-weight" type="number" class="form-control" />
      </div>
      <div class="form-group">
        <label for="edit-mother" class="form-label"><i class="fas fa-child me-2"></i>Madre (RG-D)</label>
        <input v-model="editableBovine.motherId" id="edit-mother" type="text" class="form-control" />
      </div>
      <div class="form-group">
        <label for="edit-child" class="form-label"><i class="fas fa-baby-carriage me-2"></i>Hijo (RG-D)</label>
        <input v-model="editableBovine.childId" id="edit-child" type="text" class="form-control" />
      </div>
      <div class="d-flex justify-content-between mt-3">
        <button class="btn btn-secondary" @click="toggleEdit">
          <i class="fas fa-times me-2"></i>Cancelar
        </button>
        <button class="btn btn-submit" @click="saveChanges" :disabled="!isSaveEnabled">
          <i class="fas fa-save me-2"></i>Guardar Cambios
        </button>
      </div>
    </div>
  </div>

  <div class="card-section form-section">
    <h2 class="section-title">Nuevo Protocolo de Datos</h2>
    <form @submit.prevent="submitForm">
      <div class="form-group">
        <label for="toro" class="form-label"><i class="fas fa-bullhorn me-2"></i>Toro</label>
        <select v-model="form.toro" id="toro" class="form-control" required>
          <option disabled value="">Seleccione un toro</option>
          <option v-for="bull in bulls" :key="bull" :value="bull">{{ bull }}</option>
        </select>
      </div>
      <div class="form-group">
        <label for="cc" class="form-label"><i class="fas fa-percentage me-2"></i>Condición Corporal (CC)</label>
        <input v-model="form.cc" id="cc" type="number" min="1" max="5" step="0.5" class="form-control" placeholder="1-5" required />
      </div>
      <div class="form-group">
        <label for="celo" class="form-label"><i class="fas fa-heartbeat me-2"></i>Celo</label>
        <select v-model="form.celo" id="celo" class="form-control" required>
          <option disabled value="">Seleccione una opción</option>
          <option value="Bueno">Bueno</option>
          <option value="Regular">Regular</option>
          <option value="Malo">Malo</option>
        </select>
      </div>
      <div class="form-group">
        <label for="observation" class="form-label"><i class="fas fa-eye me-2"></i>Observación</label>
        <textarea v-model="form.observation" id="observation" class="form-control" rows="3"></textarea>
      </div>
      <div class="form-group">
        <label for="others" class="form-label"><i class="fas fa-ellipsis-h me-2"></i>Otros</label>
        <textarea v-model="form.others" id="others" class="form-control" rows="3"></textarea>
      </div>
      <div class="d-grid">
        <button type="submit" class="btn btn-submit">
          <i class="fas fa-paper-plane me-2"></i>Guardar Protocolo
        </button>
      </div>
    </form>
  </div>
</div>

</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';

const isLoading = ref(true);
const loadingText = ref('Escaneando...');
let intervalId = null;

const texts = [
'Escaneando...',
'Analizando datos...',
'Conectando con el escáner...',
'Procesando información...'
];

const bovine = ref({
rgd: 'S1-456',
serie: 'A123',
sex: 'female',
weight: 450.5,
birthdate: '2022-01-15',
motherId: 'S1-455',
childId: 'S1-459'
});

const editableBovine = ref({ ...bovine.value });
const isEditing = ref(false);

const bulls = [
'mukesh', 'cia caribu', 'pancho cachon', 'delta eao', 'cia gandhi',
'magnum', 'maxima', 'upgrade', 'pro metido', 'timor', 'emblema eao', 'ferrati'
];

const form = ref({
toro: '',
cc: null,
celo: '',
observation: '',
others: '',
});

const hasChanges = computed(() => {
return JSON.stringify(editableBovine.value) !== JSON.stringify(bovine.value);
});

const areRequiredFieldsValid = computed(() => {
const { rgd, serie, sex, weight } = editableBovine.value;
return rgd && rgd.trim() !== '' &&
serie && serie.trim() !== '' &&
sex && sex.trim() !== '' &&
weight !== null && weight >= 0;
});

const isRelationshipValid = computed(() => {
const { motherId, childId } = editableBovine.value;
const motherFilled = motherId && motherId.trim() !== '';
const childFilled = childId && childId.trim() !== '';
return !(motherFilled && childFilled);
});

const isSaveEnabled = computed(() => {
return hasChanges.value && areRequiredFieldsValid.value && isRelationshipValid.value;
});

function toggleEdit() {
isEditing.value = !isEditing.value;
if (!isEditing.value) {
editableBovine.value = { ...bovine.value };
}
}

function saveChanges() {
if (isSaveEnabled.value) {
bovine.value = { ...editableBovine.value };
isEditing.value = false;
console.log('Datos del bovino actualizados:', bovine.value);
} else {
console.log('No se pueden guardar los cambios debido a errores de validación.');
}
}

function submitForm() {
console.log('Datos del protocolo guardados:', {
...form.value,
bovineRgd: bovine.value.rgd,
});
resetForm();
}

function resetForm() {
form.value = {
toro: '',
cc: null,
celo: '',
observation: '',
others: '',
};
}

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

onMounted(() => {
setTimeout(() => {
isLoading.value = false;
}, 3000);

let textIndex = 0;
intervalId = setInterval(() => {
textIndex = (textIndex + 1) % texts.length;
loadingText.value = texts[textIndex];
}, 2000);
});

onUnmounted(() => {
clearInterval(intervalId);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.bovine-detail-container {
display: flex;
flex-direction: column;
gap: 2rem;
padding: 2rem;
background-color: #f0fdf4;
font-family: 'Poppins', sans-serif;
min-height: 100vh;
justify-content: center;
align-items: center;
}

/* Estilos de la animación de carga */
.loading-container {
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 2rem;
text-align: center;
width: 100%;
height: 100%;
}

.spinner-container {
position: relative;
width: 100px;
height: 100px;
display: flex;
justify-content: center;
align-items: center;
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

@keyframes pulse {
0% {
transform: scale(0.6);
opacity: 0.5;
}
50% {
transform: scale(1.1);
opacity: 0;
}
100% {
transform: scale(0.6);
opacity: 0.5;
}
}

@keyframes fade {
0%, 100% {
opacity: 1;
}
50% {
opacity: 0.5;
}
}

/* Fin de estilos de animación */

.content-container {
display: flex;
flex-direction: column;
gap: 2rem;
width: 100%;
align-items: center;
}

.card-section {
background-color: #ffffff;
border-radius: 16px;
box-shadow: 0 8px 24px rgba(46, 125, 50, 0.1);
padding: 2.5rem;
width: 100%;
max-width: 700px;
}

.section-title {
color: #1b5e20;
font-size: 1.8rem;
font-weight: 700;
margin-bottom: 2rem;
text-align: center;
position: relative;
display: flex;
justify-content: center;
align-items: center;
gap: 0.5rem;
}

.edit-icon {
color: #2e7d32;
cursor: pointer;
transition: transform 0.2s ease;
font-size: 1.2rem;
}

.edit-icon:hover {
transform: scale(1.1);
}

.info-section {
border: 1px solid #a5d6a7;
}

.info-grid {
display: grid;
grid-template-columns: 1fr 1fr;
gap: 1.5rem;
}

.info-item {
display: flex;
align-items: center;
font-size: 1rem;
}

.info-item .label {
font-weight: 600;
color: #388e3c;
margin-right: 0.5rem;
}

.info-item .value {
color: #555;
font-weight: 400;
flex-grow: 1;
}

.icon-info {
color: #388e3c;
margin-right: 0.75rem;
}

.form-group {
margin-bottom: 1.5rem;
}

.form-label {
display: block;
margin-bottom: 0.5rem;
color: #2e7d32;
font-weight: 600;
display: flex;
align-items: center;
}

.form-control {
width: 100%;
padding: 0.8rem 1rem;
border: 1px solid #b6e2c7;
border-radius: 12px;
background-color: #f6fff8;
font-size: 1rem;
color: #333;
transition: all 0.3s ease-in-out;
}

.form-control:focus {
border-color: #43a047;
box-shadow: 0 0 0 4px rgba(67, 160, 71, 0.2);
outline: none;
}

.btn-submit {
width: 100%;
padding: 1rem;
background-color: #388e3c;
color: #ffffff;
border: none;
border-radius: 12px;
font-size: 1.1rem;
font-weight: 600;
cursor: pointer;
transition: background-color 0.3s ease, transform 0.2s ease;
box-shadow: 0 4px 12px rgba(46, 125, 50, 0.25);
}

.btn-submit:hover {
background-color: #2e7d32;
transform: translateY(-2px);
}

.btn-submit:disabled {
background-color: #a5d6a7;
cursor: not-allowed;
}

.btn-secondary {
background-color: #757575;
color: #ffffff;
border: none;
border-radius: 12px;
padding: 0.8rem 1.5rem;
font-size: 1rem;
font-weight: 600;
cursor: pointer;
transition: background-color 0.3s ease, transform 0.2s ease;
box-shadow: 0 4px 12px rgba(117, 117, 117, 0.25);
}

.btn-secondary:hover {
background-color: #616161;
transform: translateY(-2px);
}

.edit-form-container {
display: flex;
flex-direction: column;
gap: 1rem;
padding-top: 1rem;
}

/* Responsividad */
@media (max-width: 600px) {
.bovine-detail-container {
padding: 1rem;
}
.info-grid {
grid-template-columns: 1fr;
}
}
</style>