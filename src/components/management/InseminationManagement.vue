<template>
    <div class="insemination-container">

        <div v-if="isLoading" class="loading-state-premium">
            <div class="spinner-border text-success-premium mb-3" role="status"></div>
            <p class="loading-text-premium">{{ loadingText }}</p>
        </div>

        <div v-else class="content-wrapper animate__animated animate__fadeIn">

            <div class="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 class="fw-bold text-dark m-0">Historial de Inseminaciones</h4>
                    <p class="text-muted small m-0">Registros de servicios para este ciclo</p>
                </div>
                <button class="btn btn-success-premium shadow-sm px-4" @click="openModal()">
                    <i class="fas fa-plus-circle me-2"></i>NUEVA INSEMINACIÓN
                </button>
            </div>

            <div class="card-premium-table shadow-sm">
                <div class="table-responsive">
                    <table class="table align-middle mb-0">
                        <thead>
                            <tr>
                                <th class="ps-4">FECHA</th>
                                <th>TORO / SEMENTAL</th>
                                <th>CC</th>
                                <th>CELO</th>
                                <th>NOTAS</th>
                                <th class="text-end pe-4">ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in inseminations" :key="item.id" class="premium-row">
                                <td class="ps-4 fw-bold text-dark">{{ item.date }}</td>
                                <td>
                                    <div class="d-flex align-items-center gap-2">
                                        <div class="mini-icon-bull"><i class="fas fa-bull"></i></div>
                                        <span class="fw-bold text-dark">{{ item.bull_name || item.bull }}</span>
                                    </div>
                                </td>
                                <td><span class="cc-badge">{{ item.bodyConditionScore }}</span></td>
                                <td>
                                    <span :class="['status-pill-base', heatBadgeClass(item.heatQuality)]">
                                        {{ heatLabel(item.heatQuality) }}
                                    </span>
                                </td>
                                <td>
                                    <div class="d-flex gap-2">
                                        <button v-if="item.observation" class="btn-note btn-obs"
                                            @click="viewFullText('Observaciones', item.observation)">
                                            <i class="fas fa-comment-dots"></i>
                                        </button>
                                        <button v-if="item.others" class="btn-note btn-others"
                                            @click="viewFullText('Otros Detalles', item.others)">
                                            <i class="fas fa-info-circle"></i>
                                        </button>
                                        <span v-if="!item.observation && !item.others"
                                            class="text-muted small italic">Sin notas</span>
                                    </div>
                                </td>
                                <td class="text-end pe-4">
                                    <div class="btn-group">
                                        <button class="btn-action-edit" @click="openModal(item)"><i
                                                class="fas fa-pen"></i></button>
                                        <button class="btn-action-delete" @click="confirmDelete(item.id)"><i
                                                class="fas fa-trash"></i></button>
                                    </div>
                                </td>
                            </tr>
                            <tr v-if="inseminations.length === 0">
                                <td colspan="6" class="text-center py-5">
                                    <div class="empty-table-state d-flex flex-column align-items-center justify-content-center">
                                        <i class="fas fa-syringe mb-3 opacity-50 fs-2"></i>
                                        <p class="text-muted fw-bold m-0">No se han registrado inseminaciones</p>
                                        <p class="text-muted small">Haga clic en "Nueva Inseminación" para añadir un registro.</p>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="modal fade" id="inseminationModal" tabindex="-1" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered modal-lg">
                    <div class="modal-content border-0 shadow-lg rounded-4">
                        <div class="modal-header border-0 p-4 pb-0">
                            <h5 class="modal-title fw-bold text-dark">
                                <i class="fas fa-syringe text-success me-2"></i>
                                {{ editing ? 'Editar Inseminación' : 'Nueva Inseminación' }}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body p-4">
                            <form @submit.prevent="saveInsemination">
                                <div class="row g-3">
                                    <div class="col-md-6">
                                        <label class="label-premium">TORO / SEMENTAL *</label>
                                        <select v-model="form.bull" class="form-control-premium" required>
                                            <option value="" disabled>Seleccione un toro...</option>
                                            <option v-for="bull in bullsList" :key="bull.id" :value="bull.id">
                                                {{ bull.name }} {{ bull.rgd ? `(${bull.rgd})` : '' }}
                                            </option>
                                        </select>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="label-premium">CC (1-5) *</label>
                                        <input type="number" v-model="form.bodyConditionScore" step="0.5" min="1"
                                            max="5" class="form-control-premium" required>
                                    </div>
                                    <div class="col-md-3">
                                        <label class="label-premium">CALIDAD CELO *</label>
                                        <select v-model="form.heatQuality" class="form-control-premium" required>
                                            <option value="well">Bueno</option>
                                            <option value="regular">Regular</option>
                                            <option value="bad">Malo</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="label-premium">OBSERVACIONES</label>
                                        <textarea v-model="form.observation" class="form-control-premium" rows="3"
                                            placeholder="Notas del procedimiento..."></textarea>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="label-premium">OTROS DETALLES</label>
                                        <textarea v-model="form.others" class="form-control-premium" rows="3"
                                            placeholder="Información adicional..."></textarea>
                                    </div>
                                </div>

                                <div class="d-flex gap-3 mt-4">
                                    <button type="submit" class="btn btn-success-premium flex-grow-1"
                                        :disabled="!isFormValid || isSaving">
                                        {{ isSaving ? 'GUARDANDO...' : 'GUARDAR REGISTRO' }}
                                    </button>
                                    <button type="button" class="btn btn-light-premium px-4"
                                        data-bs-dismiss="modal">CANCELAR</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <div class="modal fade" id="textViewModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content border-0 shadow-lg rounded-4">
                    <div class="modal-header border-0 pb-0">
                        <h6 class="fw-bold text-success text-uppercase small m-0">{{ textModalTitle }}</h6>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <p class="text-dark bg-light p-3 rounded-3 mb-0">{{ textModalContent }}</p>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="confirmationDeleteModal" class="confirmation-overlay">
            <div
                class="confirmation-box bg-white rounded-4 shadow-lg p-4 text-center animate__animated animate__zoomIn">
                <div class="icon-circle-delete mb-3"><i class="fas fa-trash-alt"></i></div>
                <h5 class="fw-bold text-dark">¿Eliminar registro?</h5>
                <p class="text-muted small">Esta acción no se puede deshacer.</p>
                <div class="d-flex justify-content-center gap-2 mt-4">
                    <button class="btn btn-danger-premium px-4" @click="deleteInsemination">ELIMINAR</button>
                    <button class="btn btn-light-premium px-4"
                        @click="confirmationDeleteModal = false">CANCELAR</button>
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

const service = new InseminationService();
const bullService = new BullService();
const sessionPropertyStore = useSessionPropertyStore();

/* ======================
   ESTADO (ESTRUCTURA UNIFICADA)
====================== */
const inseminations = ref([]);
const bullsList = ref([]);
const isLoading = ref(false);
const isSaving = ref(false);
const editing = ref(false);
const loadingText = ref('Sincronizando historial...');
const confirmationDeleteModal = ref(false);
const selectedId = ref(null);

const textModalTitle = ref('');
const textModalContent = ref('');

const form = ref({
    id: null, bull: '', bodyConditionScore: null,
    heatQuality: 'well', observation: '', others: '',
    date: new Date().toISOString().split('T')[0]
});

/* ======================
   VALIDACIONES
====================== */
const isFormValid = computed(() => !!form.value.bull && form.value.bodyConditionScore >= 1);

/* ======================
   CRUD
====================== */
async function loadInitialData() {
    isLoading.value = true;
    loadingText.value = 'Cargando historial de inseminaciones...';
    try {
        const controlBovineId = sessionPropertyStore.getControlBovineId;
        const [inseminationData, bullsData] = await Promise.all([
            service.listInseminations(controlBovineId),
            bullService.listBulls()
        ]);
        inseminations.value = inseminationData;
        bullsList.value = bullsData;
    } catch (error) {
        showToast('error', 'Error al cargar los datos.');
    } finally {
        isLoading.value = false;
    }
}

async function saveInsemination() {
    if (!isFormValid.value) return;
    isSaving.value = true;
    try {
        const data = new Insemination({
            ...form.value,
            control_bovine_id: sessionPropertyStore.getControlBovineId
        });

        if (editing.value) {
            inseminations.value = await service.editInsemination(form.value.id, data);
            showToast('success', 'Historial actualizado.');
        } else {
            inseminations.value = await service.createInsemination(data);
            showToast('success', 'Inseminación registrada con éxito.');
        }
        Modal.getInstance(document.getElementById('inseminationModal')).hide();
    } catch (error) {
        showToast('error', 'Error al guardar.');
    } finally {
        isSaving.value = false;
    }
}

async function deleteInsemination() {
    try {
        inseminations.value = await service.deleteInsemination(selectedId.value);
        showToast('success', 'Registro eliminado.');
        confirmationDeleteModal.value = false;
    } catch (error) {
        showToast('error', 'Error al eliminar.');
    }
}

/* ======================
   HELPERS UI
====================== */
function openModal(item = null) {
    if (item) {
        editing.value = true;
        form.value = { ...item };
    } else {
        editing.value = false;
        form.value = { id: null, bull: '', bodyConditionScore: null, heatQuality: 'well', observation: '', others: '', date: new Date().toISOString().split('T')[0] };
    }
    new Modal(document.getElementById('inseminationModal')).show();
}

function confirmDelete(id) {
    selectedId.value = id;
    confirmationDeleteModal.value = true;
}

function viewFullText(title, content) {
    textModalTitle.value = title;
    textModalContent.value = content;
    new Modal(document.getElementById('textViewModal')).show();
}

function heatLabel(val) {
    const map = { well: 'Bueno', regular: 'Regular', bad: 'Malo' };
    return map[val] || val;
}

function heatBadgeClass(val) {
    const map = { well: 'bg-success-soft text-success', regular: 'bg-warning-soft text-warning', bad: 'bg-danger-soft text-danger' };
    return map[val] || 'bg-light';
}

function showToast(type, message) {
    const toastEl = document.getElementById('liveToast')
    if (toastEl) {
        const toastBody = toastEl.querySelector('.toast-body') || toastEl
        toastBody.textContent = message
        const bsToast = new Toast(toastEl)
        bsToast.show()
    }
}

onMounted(() => {
    if (sessionPropertyStore.onScanned()) {
        loadInitialData();
    }
});
</script>

<style scoped>
/* --- CARGA --- */
.loading-state-premium {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 300px;
    width: 100%;
}

.text-success-premium {
    color: #2d4a22 !important;
}

.loading-text-premium {
    color: #475569;
    font-weight: 700;
    font-size: 1.1rem;
    animation: fadePulse 1.5s infinite;
}

@keyframes fadePulse {
    0% {
        opacity: 0.6;
    }

    50% {
        opacity: 1;
    }

    100% {
        opacity: 0.6;
    }
}

/* --- TABLA PREMIUM --- */
.card-premium-table {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    border: 1px solid #edf2f7;
}

.table thead {
    background: #fcfdfc;
    border-bottom: 2px solid #f1f5f9;
}

.table thead th {
    font-size: 0.7rem;
    font-weight: 800;
    color: #94a3b8;
    letter-spacing: 1px;
    padding: 1.2rem 1rem;
    border: none;
}

.premium-row {
    transition: 0.2s;
    border-bottom: 1px solid #f8fafc;
}

.premium-row:hover {
    background-color: #fcfdfc;
}

.empty-table-state {
  color: #94a3b8;
}

/* --- BADGES & ICONS --- */
.mini-icon-bull {
    width: 32px;
    height: 32px;
    background: #f0fdf4;
    color: #16a34a;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.8rem;
}

.cc-badge {
    font-weight: 800;
    color: #475569;
    background: #f1f5f9;
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 0.9rem;
}

.status-pill-base {
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.7rem;
    font-weight: 800;
    text-transform: uppercase;
}

.bg-success-soft {
    background-color: #dcfce7 !important;
}

.bg-warning-soft {
    background-color: #fef3c7 !important;
}

.bg-danger-soft {
    background-color: #fee2e2 !important;
}

/* --- BOTONES DE ACCIÓN --- */
.btn-note {
    border: none;
    width: 30px;
    height: 30px;
    border-radius: 8px;
    font-size: 0.8rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.2s;
}

.btn-obs {
    background: #e0f2fe;
    color: #0369a1;
}

.btn-others {
    background: #f1f5f9;
    color: #64748b;
}

.btn-note:hover {
    transform: scale(1.1);
}

.btn-action-edit {
    border: none;
    background: none;
    color: #f59e0b;
    padding: 8px;
    transition: 0.2s;
}

.btn-action-delete {
    border: none;
    background: none;
    color: #ef4444;
    padding: 8px;
    transition: 0.2s;
}

.btn-action-edit:hover,
.btn-action-delete:hover {
    transform: scale(1.2);
}

/* --- FORMULARIOS --- */
.label-premium {
    font-size: 0.7rem;
    font-weight: 800;
    color: #94a3b8;
    letter-spacing: 0.5px;
    margin-bottom: 8px;
    display: block;
}

.form-control-premium {
    width: 100%;
    padding: 12px 16px;
    border: 2px solid #f1f5f9;
    border-radius: 14px;
    font-weight: 600;
    color: #1e293b;
}

.form-control-premium:focus {
    border-color: #10b981;
    outline: none;
}

/* --- BOTONES --- */
.btn-success-premium {
    background: #2d4a22;
    color: #c0da63;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
    transition: 0.3s;
}

.btn-light-premium {
    background: #f1f5f9;
    color: #64748b;
    border: none;
    padding: 12px 24px;
    border-radius: 12px;
    font-weight: 700;
}

.btn-danger-premium {
    background: #ef4444;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    font-weight: 700;
}

/* --- OVERLAY ELIMINAR --- */
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

.icon-circle-delete {
    width: 60px;
    height: 60px;
    background: #fee2e2;
    color: #ef4444;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto;
}
</style>