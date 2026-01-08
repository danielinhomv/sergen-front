<template>
  <div class="confirmatory-ultrasound-container">

    <div v-if="isLoading" class="loading-state-premium">
      <div class="spinner-border text-success-premium mb-3" role="status"></div>
      <p class="loading-text-premium">{{ loadingText }}</p>
    </div>

    <div v-else class="content-wrapper animate__animated animate__fadeIn">

      <div class="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 class="fw-bold text-dark m-0">Ecografías Confirmatorias</h4>
          <p class="text-muted small m-0">Seguimiento gestacional mediante ultrasonido</p>
        </div>
        <button class="btn btn-success-premium shadow-sm px-4" @click="openAddForm">
          <i class="fas fa-plus-circle me-2"></i>NUEVA ECOGRAFÍA
        </button>
      </div>

      <div class="card-premium-table shadow-sm">
        <div class="table-responsive">
          <table class="table align-middle mb-0">
            <thead>
              <tr>
                <th class="ps-4">FECHA</th>
                <th>ESTADO</th>
                <th>OBSERVACIÓN</th>
                <th>REFUGO</th>
                <th class="text-end pe-4">ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in ultrasounds" :key="item.id" class="premium-row">
                <td class="ps-4 fw-bold text-dark">{{ item.date }}</td>
                <td>
                  <span :class="['status-pill-base', statusBadgeClass(item.status)]">
                    {{ statusLabel(item.status) }}
                  </span>
                </td>
                <td class="text-muted small">{{ item.observation || 'Sin observaciones' }}</td>
                <td class="text-muted small">{{ item.refugo || 'Sin Refugo' }}</td>
                <td class="text-end pe-4">
                  <div class="btn-group">
                    <button class="btn-action-edit" @click="openEditForm(item)">
                      <i class="fas fa-pen"></i>
                    </button>
                    <button class="btn-action-delete" @click="confirmDelete(item.id)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>

              <tr v-if="ultrasounds.length === 0">
                <td colspan="5" class="text-center py-5">
                  <div class="empty-table-state ps-5">
                    <i class="fas fa-wave-square mb-3 opacity-50 fs-2"></i>
                    <p class="text-muted fw-bold m-0">No se han registrado ecografías confirmatorias</p>
                    <p class="text-muted small">Haga clic en "Nueva Ecografía" para añadir un registro.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="modal fade" id="ultrasoundModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
          <div class="modal-content border-0 shadow-lg rounded-4">
            <div class="modal-header border-0 p-4 pb-0">
              <h5 class="modal-title fw-bold text-dark">
                <i class="fas fa-file-medical text-success me-2"></i>
                {{ editing ? 'Editar Diagnóstico' : 'Nueva Ecografía Confirmatoria' }}
              </h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" @click="cancelForm"></button>
            </div>
            <div class="modal-body p-4">
              <form @submit.prevent="submitForm">
                <div class="row g-3">
                  <div class="col-md-6">
                    <label class="label-premium">ESTADO CONFIRMADO *</label>
                    <select v-model="form.status" class="form-control-premium" :class="{ 'is-invalid': errors.status }">
                      <option value="">Seleccione...</option>
                      <option value="pregnant">Preñada</option>
                      <option value="empty">Vacía</option>
                      <option value="discart">Descartada</option>
                    </select>
                  </div>

                  <div class="col-md-6">
                    <label class="label-premium">FECHA DEL EXAMEN *</label>
                    <input type="date" v-model="form.date" class="form-control-premium"
                      :class="{ 'is-invalid': errors.date }" />
                  </div>

                  <div class="col-12">
                    <label class="label-premium">OBSERVACIONES DEL ESPECIALISTA</label>
                    <textarea v-model="form.observation" class="form-control-premium" rows="3"
                      placeholder="Describa hallazgos (ej. días de gestación, sexo fetal, etc.)"></textarea>
                  </div>

                  <div class="col-12">
                    <label class="label-premium">REFUGO / RESUMEN CLÍNICO</label>
                    <textarea v-model="form.refugo" class="form-control-premium" rows="2"
                      placeholder="Ingrese detalles del refugo si aplica..."></textarea>
                  </div>
                </div>

                <div class="d-flex gap-3 mt-4">
                  <button class="btn btn-success-premium flex-grow-1" type="submit" :disabled="!isFormValid || isSaving">
                    {{ isSaving ? 'GUARDANDO...' : (editing ? 'ACTUALIZAR DATOS' : 'GUARDAR REGISTRO') }}
                  </button>
                  <button class="btn btn-light-premium px-4" type="button" data-bs-dismiss="modal" @click="cancelForm">
                    CANCELAR
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div v-if="confirmationDeleteModal" class="confirmation-overlay">
      <div class="confirmation-box bg-white rounded-4 shadow-lg p-4 text-center animate__animated animate__zoomIn">
        <div class="icon-circle-delete mb-3"><i class="fas fa-trash-alt"></i></div>
        <h5 class="fw-bold text-dark">¿Eliminar ecografía?</h5>
        <p class="text-muted small">Esta acción no podrá ser revertida.</p>
        <div class="d-flex justify-content-center gap-2 mt-4">
          <button class="btn btn-danger-premium px-4" @click="executeDelete">ELIMINAR</button>
          <button class="btn btn-light-premium px-4" @click="confirmationDeleteModal = false">CANCELAR</button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Estilos unificados Premium */
.loading-state-premium {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
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
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

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

.status-pill-base {
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 800;
  text-transform: uppercase;
}

.bg-success-soft { background-color: #dcfce7 !important; }
.bg-danger-soft { background-color: #fee2e2 !important; }
.bg-info-soft { background-color: #e0f2fe !important; }

.btn-action-edit { border: none; background: none; color: #f59e0b; padding: 8px; transition: 0.2s; }
.btn-action-delete { border: none; background: none; color: #ef4444; padding: 8px; transition: 0.2s; }
.btn-action-edit:hover, .btn-action-delete:hover { transform: scale(1.2); }

.empty-table-state { color: #94a3b8; }

/* Ajustes Modal */
.modal-content { border-radius: 20px; }

.label-premium {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
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

.btn-success-premium {
  background: #2d4a22;
  color: #c0da63;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
  transition: 0.3s;
}

.btn-light-premium {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
}

.btn-danger-premium {
  background: #ef4444;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 12px;
  font-weight: 700;
}

.confirmation-overlay {
  position: fixed;
  top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.icon-circle-delete {
  width: 60px; height: 60px;
  background: #fee2e2; color: #ef4444;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.5rem; margin: 0 auto;
}
</style>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Modal, Toast } from 'bootstrap'
import { ConfirmatoryUltrasoundService } from '@/services/management/ConfirmatoryUltrasoundService'
import { useSessionPropertyStore } from '@/store/SessionProperty'

const service = new ConfirmatoryUltrasoundService()
const sessionPropertyStore = useSessionPropertyStore()

/* =========================
   STATE
========================= */
const ultrasounds = ref([])
const isLoading = ref(false)
const isSaving = ref(false)
const loadingText = ref('Sincronizando...')
const editing = ref(false)
const confirmationDeleteModal = ref(false)
const selectedId = ref(null)

const form = ref({
  id: null,
  status: '',
  observation: '',
  refugo: '',
  date: new Date().toISOString().split('T')[0]
})

const errors = ref({ status: false, date: false })

/* =========================
   VALIDACIONES
========================= */
watch(() => form.value, (val) => {
  errors.value.status = !val.status
  errors.value.date = !val.date
}, { deep: true })

const isFormValid = computed(() => !!form.value.status && !!form.value.date)

/* =========================
   CRUD
========================= */
async function listUltrasounds() {
  isLoading.value = true
  loadingText.value = 'Cargando registros ecográficos...'
  try {
    ultrasounds.value = await service.list(sessionPropertyStore.getControlBovineId)
  } catch (error) {
    showToast('error', 'Error al cargar la lista de ecografías.')
  } finally {
    isLoading.value = false
  }
}

function openModal() {
  const modalElement = document.getElementById('ultrasoundModal')
  const modalInstance = new Modal(modalElement)
  modalInstance.show()
}

function openAddForm() {
  editing.value = false
  form.value = { id: null, status: '', observation: '', date: new Date().toISOString().split('T')[0], refugo: '' }
  openModal()
}

function openEditForm(item) {
  editing.value = true
  form.value = { ...item }
  openModal()
}

function cancelForm() {
  errors.value = { status: false, date: false }
}

async function submitForm() {
  if (!isFormValid.value) return
  isSaving.value = true
  try {
    if (editing.value) {
      await service.update(form.value.id, form.value)
      showToast('success', 'Ecografía actualizada correctamente.')
    } else {
      const dataToSave = {
        ...form.value,
        control_bovine_id: sessionPropertyStore.getControlBovineId
      }
      await service.create(dataToSave)
      showToast('success', 'Nuevo diagnóstico registrado.')
    }
    
    await listUltrasounds()
    
    const modalElement = document.getElementById('ultrasoundModal')
    const modalInstance = Modal.getInstance(modalElement)
    if (modalInstance) modalInstance.hide()

  } catch (error) {
    showToast('error', 'Error al procesar la solicitud.')
  } finally {
    isSaving.value = false
  }
}

function confirmDelete(id) {
  selectedId.value = id
  confirmationDeleteModal.value = true
}

async function executeDelete() {
  try {
    await service.delete(selectedId.value)
    showToast('success', 'Registro eliminado correctamente.')
    confirmationDeleteModal.value = false
    await listUltrasounds()
  } catch (error) {
    showToast('error', 'No se pudo eliminar el registro.')
  }
}

/* =========================
   HELPERS UI
========================= */
function statusLabel(value) {
  const labels = { 'pregnant': 'Preñada', 'empty': 'Vacía', 'refuge': 'Refugio', 'discart': 'Descartada' }
  return labels[value] || value
}

function statusBadgeClass(value) {
  const classes = {
    'pregnant': 'bg-success-soft text-success',
    'empty': 'bg-danger-soft text-danger',
    'discart': 'bg-info-soft text-info'
  }
  return classes[value] || 'bg-light text-muted'
}

function showToast(type, message) {
  const toastEl = document.getElementById('liveToast')
  if (toastEl) {
    // Seteamos el mensaje dinámico para evitar el error de ESLint
    const toastBody = toastEl.querySelector('.toast-body') || toastEl
    toastBody.textContent = message
    
    // Aplicamos una clase según el tipo (opcional, mejora la UX)
    toastEl.className = `toast align-items-center text-white border-0 ${type === 'error' ? 'bg-danger' : 'bg-success'}`
    
    const bsToast = new Toast(toastEl)
    bsToast.show()
  }
}

onMounted(() => {
  if (sessionPropertyStore.onScanned()) {
    listUltrasounds()
  }
})
</script>