<template>
    <div class="bovine-detail-container">

        <div v-if="isLoading" class="loading-container">
            <div class="spinner-container">
                <div class="pulsing-circle"></div>
            </div>
            <div class="text-container">
                <p class="loading-text">{{ loadingText }}</p>
            </div>
        </div>


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
                        <label for="edit-weight" class="form-label"><i
                                class="fas fa-weight-hanging me-2"></i>Peso</label>
                        <input v-model.number="editableBovine.weight" id="edit-weight" type="number"
                            class="form-control" />
                    </div>
                    <div class="form-group">
                        <label for="edit-mother" class="form-label"><i class="fas fa-child me-2"></i>Madre
                            (RG-D)</label>
                        <input v-model="editableBovine.motherId" id="edit-mother" type="text" class="form-control" />
                    </div>
                    <div class="form-group">
                        <label for="edit-child" class="form-label"><i class="fas fa-baby-carriage me-2"></i>Hijo
                            (RG-D)</label>
                        <input v-model="editableBovine.childId" id="edit-child" type="text" class="form-control" />
                    </div>
                    <div class="d-flex justify-content-between mt-3">
                        <button class="btn btn-secondary" @click="toggleEdit">
                            <i class="fas fa-times me-2"></i>Cancelar
                        </button>
                        <button class="btn btn-submit" @click="saveChanges" :disabled="!isSaveBovineEnabled">
                            <i class="fas fa-save me-2"></i>Guardar Cambios
                        </button>
                    </div>
                </div>
            </div>


            <div class="card-section protocols-section">
                <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
                    <h2 class="section-title mb-0">Historial de Inseminaciones</h2>


                    <button class="btn btn-primary-custom" @click="openAddInseminationModal">
                        <i class="fas fa-plus me-2"></i>Nuevo Registro
                    </button>
                </div>


                <div class="table-responsive">
                    <table class="table table-striped table-hover protocol-table">
                        <thead class="table-green-header">
                            <tr>
                                <th>Fecha</th>
                                <th>Toro</th>
                                <th>CC</th>
                                <th>Celo</th>
                                <th>Observación</th>
                                <th>Otros</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(protocol, index) in protocolsHistory" :key="index">
                                <td>{{ protocol.date }}</td>
                                <td>{{ protocol.bull }}</td>
                                <td>{{ protocol.bodyConditionScore }}</td>

                                <td class="protocol-detail-cell" :title="protocol.heatQuality || 'No tiene'">{{
                                    protocol.heatQuality || 'No tiene' }}</td>

                                <td class="protocol-detail-cell text-center">
                                    <template v-if="protocol.observation && protocol.observation.trim() !== ''">
                                        <i class="fas fa-eye text-primary clickable-icon"
                                            title="Ver Observación Completa"
                                            @click="showFullText(protocol.observation, 'Observación')"></i>
                                    </template>
                                    <template v-else>
                                        No tiene
                                    </template>
                                </td>

                                <td class="protocol-detail-cell text-center">
                                    <template v-if="protocol.others && protocol.others.trim() !== ''">
                                        <i class="fas fa-eye text-primary clickable-icon" title="Ver Otros Detalles"
                                            @click="showFullText(protocol.others, 'Otros')"></i>
                                    </template>
                                    <template v-else>
                                        No tiene
                                    </template>
                                </td>



                                <td>
                                    <button class="btn btn-sm btn-outline-info me-2" title="Editar Protocolo">
                                        <i class="fas fa-edit"></i> </button>
                                    <button class="btn btn-sm btn-outline-danger" title="Eliminar"><i
                                            class="fas fa-trash"></i></button>
                                </td>
                            </tr>
                            <tr v-if="protocolsHistory.length === 0">
                                <td colspan="7" class="text-center text-muted py-3">No hay protocolos registrados para
                                    este bovino.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>


        <div class="modal fade" id="protocolModal" tabindex="-1" aria-labelledby="protocolModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content modal-green-border">
                    <div class="modal-header">
                        <h5 class="modal-title section-title-modal" id="protocolModalLabel">Nuevo Protocolo de Datos
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <form @submit.prevent="submitFormAndCloseModal">
                            <div class="form-group">
                                <label for="toro" class="form-label"><i class="fas fa-bullhorn me-2"></i>Toro</label>
                                <select v-model="form.toro" id="toro" class="form-control" required>
                                    <option disabled value="">Seleccione un toro</option>
                                    <option v-for="bull in bulls" :key="bull" :value="bull">{{ bull }}</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="cc" class="form-label"><i class="fas fa-percentage me-2"></i>Condición
                                    Corporal (CC)</label>
                                <input v-model="form.bodyConditionScore" id="cc"  min="1" max="5" class="form-control"
                                    placeholder="1-5" required />
                            </div>
                            <div class="form-group">
                                <label for="celo" class="form-label"><i class="fas fa-heartbeat me-2"></i>Celo</label>
                                <select v-model="form.heatQuality" id="celo" class="form-control" required>
                                    <option disabled value="">Seleccione la calidad de celo</option> 
                                    <option value="well">Bueno</option>
                                    <option value="Regular">Regular</option>
                                    <option value="bad">Malo</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label for="observation" class="form-label"><i
                                        class="fas fa-eye me-2"></i>Observación</label>
                                <textarea v-model="form.observation" id="observation" class="form-control"
                                    rows="3"></textarea>
                            </div>
                            <div class="form-group">
                                <label for="others" class="form-label"><i
                                        class="fas fa-ellipsis-h me-2"></i>Otros</label>
                                <textarea v-model="form.others" id="others" class="form-control" rows="3"></textarea>
                            </div>

                            <div class="modal-footer px-0 pb-0 pt-3">
                                <button @click="closeModalInsemination()" type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                    <i class="fas fa-times me-2"></i>Cerrar
                                </button>
                                <button type="submit" class="btn btn-submit-modal" :disabled="!isFormValid">
                                    <i class="fas fa-paper-plane me-2"></i>Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="textViewerModal" tabindex="-1" aria-labelledby="textViewerModalLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="textViewerModalLabel">Detalle: {{ fullTextTitle }}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p style="white-space: pre-wrap;">{{ fullTextContent }}</p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080">
            <div id="liveToast" class="toast align-items-center w-100" role="alert" aria-live="assertive"
                aria-atomic="true">
                <div class="d-flex">
                    <div id="toast-icon" class="toast-body me-2">
                    </div>
                    <div id="toast-message" class="toast-body flex-grow-1">
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast"
                        aria-label="Close"></button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>

import { ref, onMounted, onUnmounted, computed } from 'vue';
import { InseminationService } from '@/services/management/InseminationService';
import { Insemination } from '@/model/management/Insemination';
import { Modal } from 'bootstrap';
import { Toast } from 'bootstrap';

const inseminationService = new InseminationService();
const isLoading = ref(true);
const loadingText = ref('Escaneando...');
const fullTextContent = ref('');
const fullTextTitle = ref('');
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
const protocolsHistory = ref([]);
const bulls = [
    'mukesh', 'cia caribu', 'pancho cachon', 'delta eao', 'cia gandhi',
    'magnum', 'maxima', 'upgrade', 'pro metido', 'timor', 'emblema eao', 'ferrati'
];
const form = ref({
    toro: '',
    bodyConditionScore: null,
    heatQuality: '',
    observation: '',
    others: '',
    date: new Date().toISOString().slice(0, 10),
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

const isCcValid = computed(() => {
    const cc = form.value.bodyConditionScore;

    if (cc === null || cc === undefined || isNaN(cc) || cc < 1 || cc > 5) {
        return false;
    }

    const multiplied = cc * 10;

    return (multiplied % 5) === 0;
});

const isSaveBovineEnabled = computed(() => {
    return hasChanges.value &&
        areRequiredFieldsValid.value &&
        isRelationshipValid.value
});

const isFormValid = computed(() => {
    return form.value.toro &&
        form.value.heatQuality &&
        isCcValid.value;
});


const openAddInseminationModal = () => {
    const modal = new Modal(document.getElementById('protocolModal'));
    modal.show();
};

const opentextViewerModal = () => {
    const modal = new Modal(document.getElementById('textViewerModal'));
    modal.show();
};

onMounted(() => {
    let textIndex = 0;
    intervalId = setInterval(() => {
        textIndex = (textIndex + 1) % texts.length;
        loadingText.value = texts[textIndex];
    }, 2000);
    fetchInseminations();

});

onUnmounted(() => {
    clearInterval(intervalId);
});

async function fetchInseminations() {
    try {
        isLoading.value = true;
        protocolsHistory.value = await inseminationService.listInseminations();
    } catch (error) {
        console.error('Error al cargar inseminaciones:', error);
    } finally {
        isLoading.value = false;
    }
}

async function submitProtocol() {
    try {
        const newInsemination = new Insemination({
            bodyConditionScore: form.value.bodyConditionScore,
            heatQuality: form.value.heatQuality,
            observation: form.value.observation,
            others: form.value.others,
            date: new Date().toISOString().slice(0, 10),
            bull: 1,
            controlBovineId: 1,
        });

        isLoading.value = true;
        protocolsHistory.value = await inseminationService.createInsemination(newInsemination);

        console.log('Nuevo Protocolo guardado con éxito.');

    } catch (error) {
        console.error('Error al crear inseminación:', error);
        alert('Error al guardar el protocolo: ' + error.message);
    } finally {
        isLoading.value = false;
    }
}

function toggleEdit() {
    isEditing.value = !isEditing.value;
    if (!isEditing.value) {
        editableBovine.value = { ...bovine.value };
    }
}

function saveChanges() {
    if (isSaveBovineEnabled.value) {
        bovine.value = { ...editableBovine.value };
        isEditing.value = false;
        console.log('Datos del bovino actualizados:', bovine.value);
    } else {
        console.log('No se pueden guardar los cambios debido a errores de validación.');
    }
}

function submitFormAndCloseModal() {
    submitProtocol();
    showToast('success', 'Protocolo guardado con éxito.'); // <-- ¡Toast agregado aquí!
    closeModalInsemination()
}

function closeModalInsemination (){
    const modalElement = document.getElementById('protocolModal');
    const modalInstance = Modal.getInstance(modalElement);
    modalInstance.hide();
    resetForm();

}


function resetForm() {
    form.value = {
        toro: '',
        bodyConditionScore: null,
        heatQuality: '',
        observation: '',
        others: '',
        date: new Date().toISOString().slice(0, 10),
    };
}

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

function showFullText(text, title) {
    if (!text || text.trim() === '') {
        return;
    }

    fullTextContent.value = text;
    fullTextTitle.value = title;

    opentextViewerModal();
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

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

.bovine-detail-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    padding: 2rem;
    background-color: #f0fdf4;
    /* Fondo muy claro (casi blanco verde) */
    font-family: 'Poppins', sans-serif;
    min-height: 100vh;
    justify-content: flex-start;
    /* Alineación al inicio para dar espacio a la tabla */
    align-items: center;
}

/* --- Estilos de Carga (Sin cambios) --- */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    text-align: center;
    width: 100%;
    height: 100%;
    min-height: 80vh;
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

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

/* --- Estilos de Contenido General --- */
.content-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    align-items: center;
    max-width: 1200px;
    /* Ancho máximo para el contenido principal */
}

.card-section {
    background-color: #ffffff;
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(46, 125, 50, 0.1);
    padding: 2.5rem;
    width: 100%;
    /* Ajuste de ancho para info section */
    max-width: 700px;
}

.info-section {
    border: 1px solid #a5d6a7;
}

/* La sección de protocolos se ajusta al ancho máximo para la tabla */
.protocols-section {
    max-width: 1200px;
    border: 1px solid #a5d6a7;
}

.section-title {
    color: #1b5e20;
    font-size: 1.8rem;
    font-weight: 700;
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

/* --- Estilos de Formulario y Controles --- */
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

/* Botón de Guardar Cambios Bovino (Verde) */
.btn-submit {
    width: auto;
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

/* Botón Secundario (Gris) */
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

/* --- Estilos Personalizados: Botón Azul y Modal Verde --- */

/* 1. Botón Azul (Requisito: Agregar nuevo registro) */
.btn-primary-custom {
    padding: 0.75rem 1.5rem;
    background-color: #1976d2;
    /* Azul Profundo */
    color: #ffffff;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}

.btn-primary-custom:hover {
    background-color: #1565c0;
    transform: translateY(-2px);
}

/* 2. Estilos de Tabla de Protocolos */
.protocol-table {
    border-radius: 12px;
    overflow: hidden;
}

.table-green-header th {
    background-color: #388e3c;
    /* Verde Oscuro para el encabezado */
    color: #ffffff;
    font-weight: 600;
    border-bottom: 2px solid #1b5e20;
}

.protocol-table tbody tr:nth-child(even) {
    background-color: #f6fff8;
    /* Fila alterna clara */
}

/* Estilo para que las celdas de detalle no sean demasiado anchas */
.protocol-detail-cell {
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

/* 3. Estilos del Modal (Temática Verde) */
.modal-content {
    border-radius: 16px;
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

/* Botón de Guardar Protocolo dentro del modal (Verde) */
.btn-submit-modal {
    padding: 0.75rem 1.5rem;
    background-color: #388e3c;
    /* Verde Oscuro */
    color: #ffffff;
    border: none;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
    box-shadow: 0 3px 8px rgba(46, 125, 50, 0.2);
}

.btn-submit-modal:hover {
    background-color: #2e7d32;
    transform: translateY(-1px);
}

/* Responsividad */
@media (max-width: 1000px) {
    .content-container {
        max-width: 95%;
    }

    .card-section {
        padding: 1.5rem;
        max-width: 100%;
    }
}

@media (max-width: 600px) {
    .bovine-detail-container {
        padding: 1rem;
    }

    .info-grid {
        grid-template-columns: 1fr;
    }

    .d-flex {
        flex-direction: column;
        align-items: stretch !important;
    }

    .btn-primary-custom {
        width: 100%;
    }

    .protocol-detail-cell {
        max-width: 100px;
        /* Reducir aún más en móvil */
    }

    .clickable-text {
        cursor: pointer;
        text-decoration: underline dotted #ccc;
    }
}
</style>
