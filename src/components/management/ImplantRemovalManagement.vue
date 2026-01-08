<template>
  <div class="implant-removal-container">

    <div v-if="isLoading" class="loading-state-premium">
      <div class="spinner-border text-success-premium mb-3" role="status"></div>
      <p class="loading-text-premium">{{ loadingText }}</p>
    </div>

    <div v-else class="content-wrapper animate__animated animate__fadeIn">

      <div v-if="!item && !showForm" class="empty-state-container">
        <div class="empty-icon-box">
          <i class="fas fa-hand-holding-medical"></i>
        </div>
        <h4 class="fw-bold text-dark">Sin registros de Retiro</h4>
        <p class="text-muted mb-4">Aún no se ha reportado el retiro de implante para este ciclo.</p>
        <button class="btn btn-success-premium shadow-sm px-5" @click="openAddForm">
          <i class="fas fa-plus-circle me-2"></i>REGISTRAR RETIRO
        </button>
      </div>

      <div v-if="item && !showForm" class="detail-card-premium shadow-sm">
        <div class="card-premium-header">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-badge-premium highlight">
                <i class="fas fa-calendar-check"></i>
              </div>
              <div>
                <span :class="['status-pill-base mb-1 d-inline-block', item.status === 'retrieved' ? 'bg-success-soft text-success' : 'bg-danger-soft text-danger']">
                  {{ statusLabel(item.status) }}
                </span>
                <h5 class="fw-bold text-dark m-0">Información del Retiro</h5>
              </div>
            </div>
            <button class="btn-edit-round" @click="openEditForm">
              <i class="fas fa-pen"></i>
            </button>
          </div>
        </div>

        <div class="card-premium-body">
          <div class="row g-4">
            <div class="col-md-6">
              <label class="label-premium">FECHA DE RETIRO</label>
              <p class="value-premium"><i class="fas fa-calendar-alt me-2 text-success"></i>{{ item.date }}</p>
            </div>
            <div class="col-md-6" v-if="item.work_team">
              <label class="label-premium">EQUIPO DE TRABAJO</label>
              <p class="value-premium"><i class="fas fa-users me-2 text-success"></i>{{ item.work_team }}</p>
            </div>

            <div class="col-12" v-if="item.used_products_summary">
              <div class="premium-divider"></div>
              <label class="label-premium">RESUMEN DE PRODUCTOS USADOS</label>
              <div class="text-box-premium highlight">
                <i class="fas fa-box-open me-2 text-success"></i><strong>{{ item.used_products_summary }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="form-premium-card animate__animated animate__fadeInUp">
        <div class="form-header-premium mb-4">
          <h5 class="text-dark fw-bold m-0">
            <i class="fas fa-clipboard-check text-success me-2"></i>
            {{ editing ? 'Editar Datos del Retiro' : 'Nuevo Registro de Retiro' }}
          </h5>
          <p class="text-muted small">Ingrese los detalles técnicos del procedimiento</p>
        </div>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="label-premium">ESTADO DEL IMPLANTE *</label>
              <select v-model="form.status" class="form-control-premium" :class="{ 'is-invalid': errors.status }">
                <option value="">Seleccione...</option>
                <option value="retrieved">Recuperado</option>
                <option value="lost">Perdido</option>
              </select>
            </div>

            <div class="col-md-6">
              <label class="label-premium">FECHA DE RETIRO *</label>
              <input type="date" v-model="form.date" class="form-control-premium" :class="{ 'is-invalid': errors.date }" />
            </div>

            <div class="col-12">
              <label class="label-premium">EQUIPO DE TRABAJO</label>
              <input type="text" v-model="form.work_team" class="form-control-premium" placeholder="Ej: Dr. Pérez, Asistente..." />
            </div>

            <div class="col-12">
              <label class="label-premium">RESUMEN DE PRODUCTOS USADOS</label>
              <textarea v-model="form.used_products_summary" class="form-control-premium" rows="2" 
                placeholder="Ej: Benzoato de estradiol, Prostaglandina..."></textarea>
            </div>
          </div>

          <div class="d-flex gap-3 mt-5">
            <button class="btn btn-success-premium px-5" type="submit" :disabled="!isFormValid || isSaving">
              {{ isSaving ? 'GUARDANDO...' : (editing ? 'ACTUALIZAR DATOS' : 'GUARDAR RETIRO') }}
            </button>
            <button class="btn btn-light-premium px-4" type="button" @click="cancelForm">
              CANCELAR
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Toast } from 'bootstrap'
import { ImplantRemovalService } from '@/services/management/ImplantRemovalService'
import { useSessionPropertyStore } from '@/store/SessionProperty'

const service = new ImplantRemovalService()
const sessionPropertyStore = useSessionPropertyStore()

/* ======================
   ESTADO (ESTRUCTURA UNIFICADA)
====================== */
const item = ref(null)
const isLoading = ref(false)
const isSaving = ref(false)
const loadingText = ref('Escanee un bovino para cargar los datos...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  status: '',
  work_team: '',
  used_products_summary: '',
  date: new Date().toISOString().split('T')[0]
})

const errors = ref({ status: false, date: false })

/* ======================
   VALIDACIONES
====================== */
watch(() => form.value, () => {
  errors.value.status = !form.value.status
  errors.value.date = !form.value.date
}, { deep: true })

const isFormValid = computed(() => !!form.value.status && !!form.value.date && !! form.value.used_products_summary && !! form.value.work_team)

/* ======================
   CRUD (ESTRUCTURA UNIFICADA)
====================== */
async function loadItem() {
  isLoading.value = true
  loadingText.value = 'Cargando datos de retiro...'
  try {
    const response = await service.get(sessionPropertyStore.getControlBovineId)
    item.value = response || null
  } catch (error) {
    item.value = null
    showToast('error', error.message || 'Error al cargar los datos.')
  } finally {
    isLoading.value = false
  }
}

function openAddForm() {
  editing.value = false
  form.value = {
    id: null, status: '', work_team: '',
    used_products_summary: '', date: new Date().toISOString().split('T')[0]
  }
  showForm.value = true
}

function openEditForm() {
  editing.value = true
  form.value = { ...item.value }
  showForm.value = true
}

function cancelForm() { showForm.value = false }

async function submitForm() {
  if (!isFormValid.value) return
  isSaving.value = true
  try {
    if (editing.value) {
      await service.update(form.value.id, form.value)
      showToast('success', 'Registro actualizado correctamente.')
    } else {
      // Usar IDs de sesión
      const dataToSave = { 
        ...form.value, 
        control_bovine_id: sessionPropertyStore.getControlBovineId,
        property_id: sessionPropertyStore.getPropertyId 
      }
      await service.create(dataToSave)
      showToast('success', 'Retiro registrado correctamente.')
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    showToast('error', 'Ocurrió un error al guardar.')
  } finally {
    isSaving.value = false
  }
}

/* ======================
   HELPERS UI
====================== */
function statusLabel(value) {
  return value === 'retrieved' ? 'Recuperado' : 'Perdido'
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
    loadItem()
  }
})
</script>

<style scoped>
/* --- ESTRUCTURA DE CARGA (IDÉNTICO A PARTO) --- */
.loading-state-premium {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  width: 100%;
}

.text-success-premium { color: #2d4a22 !important; }
.spinner-border { width: 3rem; height: 3rem; }
.loading-text-premium {
  color: #475569;
  font-weight: 700;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
  animation: fadePulse 1.5s infinite;
}

@keyframes fadePulse {
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
}

/* --- EMPTY STATE --- */
.empty-state-container {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 24px;
  border: 2px dashed #e2e8f0;
}

.empty-icon-box {
  width: 80px;
  height: 80px;
  background: #f0fdf4;
  color: #16a34a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin: 0 auto 20px;
}

/* --- CARD DETALLE --- */
.detail-card-premium {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid #edf2f7;
}

.card-premium-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid #f1f5f9;
  background: #fcfdfc;
}

.card-premium-body { padding: 2rem; }

.icon-badge-premium {
  width: 50px;
  height: 50px;
  background: #2d4a22;
  color: #c0da63;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.icon-badge-premium.highlight { background: #16a34a; color: white; }

/* --- BADGES Y LABELS --- */
.status-pill-base {
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.bg-success-soft { background-color: #dcfce7 !important; }
.bg-danger-soft { background-color: #fee2e2 !important; }

.label-premium {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: block;
}

.value-premium {
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  font-size: 1.1rem;
}

.text-box-premium {
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #475569;
  border: 1px solid #f1f5f9;
}

.text-box-premium.highlight { background: #f0fdf4; border-color: #dcfce7; }
.premium-divider { height: 1px; background: #f1f5f9; margin: 15px 0; }

/* --- FORMULARIO --- */
.form-premium-card { background: white; border-radius: 20px; padding: 2rem; }

.form-control-premium {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #f1f5f9;
  border-radius: 14px;
  font-weight: 600;
  transition: 0.3s;
  color: #1e293b;
}

.form-control-premium:focus { border-color: #10b981; outline: none; background: #fcfdfc; }

/* --- BOTONES --- */
.btn-success-premium {
  background: #2d4a22;
  color: #c0da63;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
  transition: 0.3s;
}

.btn-success-premium:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(45, 74, 34, 0.2);
}

.btn-light-premium {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
}

.btn-edit-round {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: #f1f5f9;
  color: #64748b;
  transition: 0.3s;
}
</style>