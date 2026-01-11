<template>
  <div class="birth-container">

    <div v-if="!sessionPropertyStore.onScanned" class="loading-state-premium">
      <div class="spinner-border text-success-premium mb-3" role="status"></div>
      <p class="loading-text-premium">{{ loadingText }}</p>
    </div>

    <div v-else class="content-wrapper animate__animated animate__fadeIn">

      <div v-if="!item && !showForm" class="empty-state-container">
        <div class="empty-icon-box">
          <i class="fas fa-baby-carriage"></i>
        </div>
        <h4 class="fw-bold text-dark">Sin registros de Parto</h4>
        <p class="text-muted mb-4">Aún no se ha reportado el nacimiento para esta madre.</p>
        <button class="btn btn-success-premium shadow-sm px-5" @click="openAddForm">
          <i class="fas fa-plus-circle me-2"></i>REGISTRAR PARTO
        </button>
      </div>

      <div v-if="item && !showForm" class="detail-card-premium shadow-sm">
        <div class="card-premium-header">
          <div class="d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center gap-3">
              <div class="icon-badge-premium">
                <i class="fas fa-cow"></i>
              </div>
              <div>
                <span :class="['status-pill-base mb-1 d-inline-block', statusClass(item.typeOfBirth)]">
                  {{ typeOfBirthLabel(item.typeOfBirth) }}
                </span>
                <h5 class="fw-bold text-dark m-0">Información del Nacimiento</h5>
              </div>
            </div>
            <button class="btn-edit-round" @click="openEditForm">
              <i class="fas fa-pen"></i>
            </button>
          </div>
        </div>

        <div class="card-premium-body">
          <div class="row g-4">
            <div class="col-md-3">
              <label class="label-premium">FECHA DE PARTO</label>
              <p class="value-premium"><i class="fas fa-calendar-alt me-2 text-success"></i>{{ item.birthdate }}</p>
            </div>
            
            <div class="col-md-3" v-if="isNormalOrPremature(item.typeOfBirth)">
              <label class="label-premium">SEXO DE LA CRÍA</label>
              <p class="value-premium">
                <i :class="item.sex === 'male' ? 'fas fa-mars text-primary' : 'fas fa-venus text-danger'"
                  class="me-2"></i>
                {{ sexLabel(item.sex) }}
              </p>
            </div>
            
            <div class="col-md-3" v-if="isNormalOrPremature(item.typeOfBirth)">
              <label class="label-premium">PESO AL NACER</label>
              <p class="value-premium"><i class="fas fa-weight-hanging me-2 text-success"></i>{{ item.birthWeight }} kg
              </p>
            </div>
            
            <div class="col-md-3" v-if="isNormalOrPremature(item.typeOfBirth) && item.rgd">
              <label class="label-premium">RGD / REGISTRO</label>
              <p class="value-premium"><i class="fas fa-tag me-2 text-success"></i>{{ item.rgd }}</p>
            </div>

            <div class="col-12" v-if="item.bullFather">
              <div class="premium-divider"></div>
              <label class="label-premium">TORO PADRE (GENÉTICA)</label>
              <div class="text-box-premium highlight">
                <i class="fas fa-dna me-2 text-success"></i><strong>{{ item.bullFather }}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="form-premium-card animate__animated animate__fadeInUp">
        <div class="form-header-premium mb-4">
          <h5 class="text-dark fw-bold m-0">
            <i class="fas fa-clipboard-check text-success me-2"></i>
            {{ editing ? 'Editar Datos del Parto' : 'Registrar Nuevo Parto' }}
          </h5>
          <p class="text-muted small">Ingrese los detalles técnicos del nacimiento</p>
        </div>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="label-premium">FECHA DE PARTO *</label>
              <input type="date" v-model="form.birthdate" class="form-control-premium"
                :class="{ 'is-invalid': errors.birthdate }" />
            </div>

            <div class="col-md-6">
              <label class="label-premium">TIPO DE PARTO *</label>
              <select v-model="form.typeOfBirth" class="form-control-premium"
                :class="{ 'is-invalid': errors.typeOfBirth }">
                <option value="">Seleccione...</option>
                <option value="normal">Normal</option>
                <option value="premeture">Prematuro</option>
                <option value="abort">Aborto</option>
                <option value="stillbirth">Muerte al nacer</option>
              </select>
            </div>

            <div class="col-md-6" v-if="isNormalOrPremature(form.typeOfBirth)">
              <label class="label-premium">SEXO DE LA CRÍA *</label>
              <select v-model="form.sex" class="form-control-premium" :class="{ 'is-invalid': errors.sex }">
                <option value="">Seleccione...</option>
                <option value="male">Macho</option>
                <option value="female">Hembra</option>
              </select>
            </div>

            <div class="col-md-6" v-if="isNormalOrPremature(form.typeOfBirth)">
              <label class="label-premium">PESO AL NACER (KG) *</label>
              <input type="number" min="0.1" step="0.1" v-model="form.birthWeight" class="form-control-premium"
                :class="{ 'is-invalid': errors.birthWeight }" />
            </div>

            <div class="col-12" v-if="isNormalOrPremature(form.typeOfBirth)">
              <label class="label-premium">RGD</label>
              <input type="text" v-model="form.rgd" class="form-control-premium" placeholder="Ej: RGD12345" />
            </div>
          </div>

          <div class="d-flex gap-3 mt-5">
            <button class="btn btn-success-premium px-5" type="submit" :disabled="!isFormValid || isSaving">
              {{ isSaving ? 'GUARDANDO...' : (editing ? 'ACTUALIZAR DATOS' : 'GUARDAR PARTO') }}
            </button>
            <button class="btn btn-light-premium px-4" type="button" @click="cancelForm">
              CANCELAR
            </button>
          </div>
        </form>
      </div>
    </div>

    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080">
      <div id="liveToast" class="toast align-items-center border-0 shadow-lg text-white" role="alert"
        aria-live="assertive" aria-atomic="true">
        <div class="d-flex">
          <div id="toast-message" class="toast-body flex-grow-1 p-3 fw-bold"></div>
          <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from 'vue'
import { Toast } from 'bootstrap'
import { BirthService } from '@/services/management/BirthService'
import { Birth } from '@/model/management/Birth'
import { useSessionPropertyStore } from '@/store/SessionProperty'

const birthService = new BirthService()
const sessionPropertyStore = useSessionPropertyStore()

const item = ref(null)
const isSaving = ref(false)
const loadingText = ref('Escanee un bovino para cargar los datos...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null, birthdate: '', sex: '', birthWeight: '',
  typeOfBirth: '', rgd: '', controlBovineId: null,
  bovineId: null, propertyId: null
})

const errors = ref({ birthdate: false, sex: false, birthWeight: false, typeOfBirth: false })

function isNormalOrPremature(type) {
  return type === 'normal' || type === 'premeture'
}

// FUNCIÓN showToast IDÉNTICA A TU COMPONENTE DE SEMENTALES
function showToast(message, type = 'success') {
  const toastEl = document.getElementById('liveToast');
  if (toastEl) {
    toastEl.className = `toast align-items-center border-0 shadow-lg text-white bg-${type === 'success' ? 'success' : 'danger'}`;
    document.getElementById('toast-message').textContent = message;
    new Toast(toastEl).show();
  }
}

watch(() => form.value, () => {
  const viable = isNormalOrPremature(form.value.typeOfBirth);
  errors.value = {
    birthdate: !form.value.birthdate,
    typeOfBirth: !form.value.typeOfBirth,
    sex: viable ? !form.value.sex : false,
    birthWeight: viable ? (!form.value.birthWeight || parseFloat(form.value.birthWeight) <= 0) : false
  }
}, { deep: true })

const isFormValid = computed(() => {
  const basicValid = form.value.birthdate && form.value.typeOfBirth && 
                     form.value.propertyId && form.value.controlBovineId;
  const viable = isNormalOrPremature(form.value.typeOfBirth);
  const fieldsForViableValid = viable ? (form.value.sex && form.value.birthWeight > 0) : true;
  return basicValid && fieldsForViableValid;
})

async function loadItem() {
  loadingText.value = 'Cargando datos de parto...'
  try {
    const response = await birthService.get(sessionPropertyStore.getControlBovineId)
    item.value = response
  } catch (error) {
    item.value = null
  } 
}

function openAddForm() {
  editing.value = false
  form.value = {
    id: null, birthdate: new Date().toISOString().split('T')[0],
    sex: '', birthWeight: '', typeOfBirth: 'normal', rgd: '',
    controlBovineId: sessionPropertyStore.getControlBovineId,
    bovineId: sessionPropertyStore.getBovineId,
    propertyId: sessionPropertyStore.getPropertyId
  }
  showForm.value = true
}

function openEditForm() {
  editing.value = true
  form.value = {
    ...item.value,
    bovineId: sessionPropertyStore.getBovineId,
    propertyId: sessionPropertyStore.getPropertyId
  }
  showForm.value = true
}

async function submitForm() {
  if (!isFormValid.value) return
  isSaving.value = true
  
  if (!isNormalOrPremature(form.value.typeOfBirth)) {
    form.value.birthWeight = 0;
    form.value.rgd = '';
    form.value.sex = 'unknown';
  }

  try {
    const birthData = new Birth(form.value)
    if (editing.value) {
      await birthService.updateBirth(form.value.id, birthData)
      showToast('¡Parto actualizado!');
    } else {
      await birthService.createBirth(birthData)
      showToast('¡Parto registrado con éxito!');
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    showToast('Error al guardar', 'danger');
  } finally {
    isSaving.value = false
  }
}

function cancelForm() { showForm.value = false }

function sexLabel(value) { 
  if(value === 'male') return 'Macho';
  if(value === 'female') return 'Hembra';
  return 'No registrado';
}

function typeOfBirthLabel(value) {
  const types = { 'normal': 'Normal', 'premeture': 'Prematuro', 'abort': 'Aborto', 'stillbirth': 'Muerte al nacer' }
  return types[value] || value
}

function statusClass(value) {
  if (value === 'normal') return 'bg-success-soft text-success'
  if (value === 'abort' || value === 'stillbirth') return 'bg-danger-soft text-danger'
  return 'bg-info-soft text-info'
}

onMounted(() => {
  if (sessionPropertyStore.onScanned) {
    loadItem()
  }
})
</script>

<style scoped>
/* --- ESTRUCTURA DE CARGA --- */
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

.spinner-border {
  width: 3rem;
  height: 3rem;
}

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
  padding: 3rem;
  background: white;
  border-radius: 24px;
  border: 2px dashed #e2e8f0;
}

.empty-icon-box {
  width: 80px;
  height: 80px;
  background: #fff1f2;
  color: #e11d48;
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

.card-premium-body {
  padding: 2rem;
}

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

/* --- BADGES --- */
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
.bg-info-soft { background-color: #e0f2fe !important; }

/* --- ELEMENTOS FORM --- */
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
  font-size: 1rem;
}

.text-box-premium {
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  font-size: 0.9rem;
  color: #475569;
  border: 1px solid #f1f5f9;
}

.text-box-premium.highlight {
  background: #f0fdf4;
  border-color: #dcfce7;
}

.premium-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 15px 0;
}

.form-premium-card {
  background: white;
  border-radius: 20px;
  padding: 2rem;
}

.form-control-premium {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #f1f5f9;
  border-radius: 14px;
  font-weight: 600;
  transition: 0.3s;
  color: #1e293b;
}

.form-control-premium:focus {
  border-color: #10b981;
  outline: none;
  background: #fcfdfc;
}

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