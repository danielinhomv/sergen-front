<template>
    <div class="insemination-container">
        <div v-if="isLoading" class="loading-container">
            <div class="spinner-container">
                <div class="pulsing-circle"></div>
            </div>
            <p class="loading-text">{{ loadingText }}</p>
        </div>

        <div v-else class="content-container animate__animated animate__fadeIn">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <h4 class="text-success fw-bold m-0">
                    <i class="fas fa-history me-2"></i>Historial de Inseminaciones
                </h4>
                <button class="btn btn-success shadow-sm fw-bold px-4" @click="openModal()">
                    <i class="fas fa-plus-circle me-2"></i>Nuevo Registro
                </button>
            </div>

            <div class="card border-0 shadow-sm rounded-4 overflow-hidden">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="bg-light-success">
                            <tr>
                                <th class="ps-4">Fecha</th>
                                <th>Toro</th>
                                <th>CC</th>
                                <th>Celo</th>
                                <th>Notas (Obs / Otros)</th>
                                <th class="text-end pe-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in inseminations" :key="item.id">
                                <td class="ps-4 fw-medium text-dark">{{ item.date }}</td>
                                <td>
                                    <span class="badge bg-light text-success border border-success-subtle px-3 py-2">
                                        <i class="fas fa-bull me-1"></i> {{ item.bull_name || item.bull }}
                                    </span>
                                </td>
                                <td><span class="fw-bold text-muted">{{ item.bodyConditionScore }}</span></td>
                                <td>
                                    <span :class="heatBadgeClass(item.heatQuality)">
                                        {{ heatLabel(item.heatQuality) }}
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex gap-2">
                                        <button v-if="item.observation"
                                            class="btn btn-sm btn-light-primary rounded-pill px-3"
                                            @click="viewFullText('Observaciones', item.observation)">
                                            <i class="fas fa-comment-alt me-1"></i> Obs.
                                        </button>
                                        <button v-if="item.others" class="btn btn-sm btn-light-info rounded-pill px-3"
                                            @click="viewFullText('Otros Detalles', item.others)">
                                            <i class="fas fa-ellipsis-h me-1"></i> Otros
                                        </button>
                                        <span v-if="!item.observation && !item.others"
                                            class="text-muted small italic">Sin notas</span>
                                    </div>
                                </td>
                                <td class="text-end pe-4">
                                    <div class="btn-group">
                                        <button class="btn btn-sm btn-outline-warning border-0"
                                            @click="openModal(item)">
                                            <i class="fas fa-edit"></i>
                                        </button>
                                        <button class="btn btn-sm btn-outline-danger border-0"
                                            @click="confirmDelete(item.id)">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="inseminations.length === 0">
                                <td colspan="6" class="text-center py-5 text-muted">No hay registros aún.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div class="modal fade" id="inseminationModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0 pb-0 ps-4 pt-4">
                        <h5 class="modal-title fw-bold text-success">
                            <i class="fas fa-syringe me-2"></i>{{ editing ? 'Editar Inseminación' : 'Nueva Inseminación'
                            }}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body p-4">
                        <form @submit.prevent="saveInsemination">
                            <div class="row g-3">
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted text-uppercase">Toro / Semental
                                        *</label>
                                    <select v-model="form.bull" class="form-select border-success-subtle shadow-none"
                                        required>
                                        <option value="" disabled>Seleccione un toro...</option>
                                        <option v-for="bull in bullsList" :key="bull.id" :value="bull.id">
                                            {{ bull.name }} {{ bull.rgd ? `(${bull.rgd})` : '' }}
                                        </option>
                                    </select>
                                </div>

                                <div class="col-md-3">
                                    <label class="form-label small fw-bold text-muted text-uppercase">CC (1-5) *</label>
                                    <input type="number" v-model="form.bodyConditionScore" step="0.5" min="1" max="5"
                                        class="form-control border-success-subtle shadow-none" required>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label small fw-bold text-muted text-uppercase">Celo *</label>
                                    <select v-model="form.heatQuality"
                                        class="form-select border-success-subtle shadow-none" required>
                                        <option value="well">Bueno</option>
                                        <option value="regular">Regular</option>
                                        <option value="bad">Malo</option>
                                    </select>
                                </div>
                                <div class="col-md-6">
                                    <label
                                        class="form-label small fw-bold text-muted text-uppercase">Observaciones</label>
                                    <textarea v-model="form.observation"
                                        class="form-control border-success-subtle shadow-none" rows="4"
                                        placeholder="Notas sobre el procedimiento..."></textarea>
                                </div>
                                <div class="col-md-6">
                                    <label class="form-label small fw-bold text-muted text-uppercase">Otros
                                        Detalles</label>
                                    <textarea v-model="form.others"
                                        class="form-control border-success-subtle shadow-none" rows="4"
                                        placeholder="Información adicional..."></textarea>
                                </div>
                            </div>

                            <div class="d-flex gap-2 mt-4">
                                <button type="submit" class="btn btn-success flex-grow-1 fw-bold py-2 shadow-sm"
                                    :disabled="!isFormValid || isSaving">
                                    <i class="fas fa-save me-2"></i> {{ isSaving ? 'Guardando...' : 'Guardar Registro'
                                    }}
                                </button>
                                <button type="button" class="btn btn-light px-4 fw-bold"
                                    data-bs-dismiss="modal">Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>

        <div class="modal fade" id="textViewModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-bottom-0 pb-0">
                        <h6 class="modal-title fw-bold text-success text-uppercase small">{{ textModalTitle }}</h6>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-dark bg-light p-3 rounded-3 mb-0" style="white-space: pre-wrap;">{{
                            textModalContent }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="confirmationDeleteModal" class="confirmation-overlay">
            <div class="confirmation-box bg-white rounded-4 shadow-lg p-4 text-center">
                <div class="icon-circle bg-light-danger text-danger mb-3"><i class="fas fa-trash-alt fs-4"></i></div>
                <h5 class="fw-bold">¿Eliminar registro?</h5>
                <div class="d-flex justify-content-center gap-2 mt-4">
                    <button class="btn btn-danger px-4 fw-bold" @click="deleteInsemination">Eliminar</button>
                    <button class="btn btn-light px-4 fw-bold"
                        @click="confirmationDeleteModal = false">Cancelar</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { InseminationService } from '@/services/management/InseminationService';
import { BullService } from '@/services/management/BullService';
import { Insemination } from '@/model/management/Insemination';
import { Modal, Toast } from 'bootstrap';
import { useSessionPropertyStore } from '@/store/SessionProperty';

/* --- SERVICIOS --- */
const service = new InseminationService();
const bullService = new BullService();
const sessionPropertyStore = useSessionPropertyStore();
/* ======================
   STATE
====================== */
const inseminations = ref([]);
const bullsList = ref([]);
const controlBovineId = ref(null); // Guardará el ID dinámico de la relación
const editing = ref(false);
const isSaving = ref(false);
const confirmationDeleteModal = ref(false);
const selectedId = ref(null);
const loadingText = ref('Sincronizando protocolo...');

const textModalTitle = ref('');
const textModalContent = ref('');

const isLoading = computed(() => !sessionPropertyStore.onScanned());

const form = ref({
    id: null,
    bull: '',
    bodyConditionScore: null,
    heatQuality: 'well',
    observation: '',
    others: '',
    date: new Date().toISOString().split('T')[0]
});

/* ======================
   VALIDACIONES
====================== */
const isFormValid = computed(() => form.value.bull && form.value.bodyConditionScore >= 1);

/* ======================
   CRUD & DATA LOAD
====================== */

/**
 * Proceso Secuencial:
 * 1. Crea/Obtiene el vínculo (ControlBovine)
 * 2. Carga en paralelo: Toros e Inseminaciones usando el ID obtenido
 */
async function loadInitialData() {
    try {
        let controlBovineId = sessionPropertyStore.getControlBovineId;

        const [inseminationData, bullsData] = await Promise.all([
            service.listInseminations(controlBovineId.value),
            bullService.listBulls()
        ]);

        inseminations.value = inseminationData;
        bullsList.value = bullsData;
    } catch (error) {
        console.error(error);
        showToast('error', 'Error al sincronizar protocolo: ' + error.message);
    }
}

async function saveInsemination() {
    isSaving.value = true;
    try {
        const data = new Insemination({
            ...form.value,
            control_bovine_id: controlBovineId.value
        });

        if (editing.value) {
            inseminations.value = await service.editInsemination(form.value.id, data);
            showToast('success', 'Historial actualizado.');
        } else {
            inseminations.value = await service.createInsemination(data);
            showToast('success', 'Inseminación registrada.');
        }

        Modal.getInstance(document.getElementById('inseminationModal')).hide();
    } catch (error) {
        showToast('error', 'Error al guardar.');
    } finally {
        isSaving.value = false;
    }
}

/* ======================
   HELPERS UI
====================== */

function openModal(item = null) {
    if (item) {
        editing.value = true;
        form.value = {
            id: item.id,
            bull: item.bull,
            bodyConditionScore: item.bodyConditionScore,
            heatQuality: item.heatQuality,
            observation: item.observation,
            others: item.others,
            date: item.date
        };
    } else {
        editing.value = false;
        resetForm();
    }
    new Modal(document.getElementById('inseminationModal')).show();
}

async function deleteInsemination() {
    try {
        inseminations.value = await service.deleteInsemination(selectedId.value);
        showToast('success', 'Eliminado correctamente.');
        confirmationDeleteModal.value = false;
    } catch (error) {
        showToast('error', 'Error al eliminar.');
    }
}

function viewFullText(title, content) {
    textModalTitle.value = title;
    textModalContent.value = content;
    new Modal(document.getElementById('textViewModal')).show();
}

function confirmDelete(id) {
    selectedId.value = id;
    confirmationDeleteModal.value = true;
}

function heatLabel(val) {
    const map = { well: 'Bueno', regular: 'Regular', bad: 'Malo' };
    return map[val] || val;
}

function heatBadgeClass(val) {
    const map = { well: 'bg-light-success text-success', regular: 'bg-light-warning text-warning', bad: 'bg-light-danger text-danger' };
    return `badge px-3 py-2 ${map[val] || 'bg-light'}`;
}

function resetForm() {
    form.value = { id: null, bull: '', bodyConditionScore: null, heatQuality: 'well', observation: '', others: '', date: new Date().toISOString().split('T')[0] };
}

function showToast(type, message) {
    const toastEl = document.getElementById('liveToast');
    if (!toastEl) return;
    toastEl.className = `toast align-items-center w-100 text-white border-0 ${type === 'success' ? 'bg-success' : 'bg-danger'}`;
    document.getElementById('toast-message').textContent = message;
    Toast.getOrCreateInstance(toastEl).show();
}

onMounted(() => {
    if (sessionPropertyStore.onScanned()) {
        loadInitialData();
    } else {
        showToast('warning', 'Debe escanear un bovino primero');
    }
});

</script>

<style scoped>
/* (Estilos idénticos al anterior para mantener la estética profesional) */
.insemination-container {
    padding: 1.5rem;
}

.bg-light-success {
    background-color: #f0fdf4 !important;
}

.bg-light-warning {
    background-color: #fffbeb !important;
}

.bg-light-danger {
    background-color: #fef2f2 !important;
}

.btn-light-primary {
    background-color: #e0f2fe;
    color: #0369a1;
    border: none;
    font-size: 0.75rem;
    font-weight: 600;
}

.btn-light-info {
    background-color: #f0f9ff;
    color: #0891b2;
    border: none;
    font-size: 0.75rem;
    font-weight: 600;
}

.confirmation-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
}

.confirmation-box {
    width: 350px;
}

.loading-container {
    min-height: 60vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.pulsing-circle {
    width: 80px;
    height: 80px;
    background-color: #28a745;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
}

@keyframes pulse {
    0% {
        transform: scale(0.6);
        opacity: 0.8;
    }

    100% {
        transform: scale(1.2);
        opacity: 0;
    }
}
</style>