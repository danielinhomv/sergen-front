<template>
  <div class="presynch-container">

    <div v-if="!sessionPropertyStore.onScanned" class="loading-state-premium">
      <div class="spinner-border text-success-premium mb-3" role="status"></div>
      <p class="loading-text-premium">{{ loadingText }}</p>
    </div>

    <div v-else class="content-wrapper animate__animated animate__fadeIn">

      <div v-if="!item && !showForm" class="empty-state-container">
        <div class="empty-icon-box">
          <i class="fas fa-vial"></i>
        </div>
        <h4 class="fw-bold text-dark">Sin Pre-sincronización</h4>
        <p class="text-muted mb-4">No se ha registrado ningún protocolo preventivo para este ciclo.</p>
        <button class="btn btn-success-premium shadow-sm px-5" @click="openAddForm">
          <i class="fas fa-plus-circle me-2"></i>REGISTRAR PRESINCRONIZACIÓN
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
                <span class="status-pill-base bg-success-soft text-success mb-1 d-inline-block">Protocolo Activo</span>
                <h5 class="fw-bold text-dark m-0">Pre-sincronización Aplicada</h5>
              </div>
            </div>
            <button class="btn-edit-round" @click="openEditForm">
              <i class="fas fa-pen"></i>
            </button>
          </div>
        </div>

        <div class="card-premium-body">
          <div class="row g-4">
            <div class="col-md-4">
              <label class="label-premium">FECHA DE APLICACIÓN</label>
              <p class="value-premium"><i class="fas fa-calendar-check me-2 text-success"></i>{{ item.applicationDate }}
              </p>
            </div>
            <div class="col-md-8">
              <label class="label-premium">ESTADO NUTRICIONAL</label>
              <div :class="item.vitaminsAndMinerals ? 'vitamin-badge-on' : 'vitamin-badge-off'">
                <i :class="item.vitaminsAndMinerals ? 'fas fa-shield-virus' : 'fas fa-exclamation-triangle'"
                  class="me-2"></i>
                {{ item.vitaminsAndMinerals ? 'Vitaminas y Minerales Aplicados' : 'Sin Vitaminas/Minerales' }}
              </div>
            </div>

            <div class="col-12 mt-2">
              <div class="premium-divider"></div>
              <label class="label-premium mb-3">PRODUCTOS UTILIZADOS</label>
              <div class="row g-3">
                <div class="col-md-4">
                  <div class="product-item-premium">
                    <span class="product-category">Vacuna Reprod.</span>
                    <span class="product-name">{{ item.reproductiveVaccine }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="product-item-premium">
                    <span class="product-category">Sincrogest</span>
                    <span class="product-name">{{ item.sincrogestProduct }}</span>
                  </div>
                </div>
                <div class="col-md-4">
                  <div class="product-item-premium">
                    <span class="product-category">Antiparasitario</span>
                    <span class="product-name">{{ item.antiparasiticProduct }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showForm" class="form-premium-card animate__animated animate__fadeInUp">
        <div class="form-header-premium mb-4">
          <h5 class="text-dark fw-bold m-0">
            <i class="fas fa-file-medical text-success me-2"></i>
            {{ editing ? 'Editar Registro Sanitario' : 'Nuevo Registro de Protocolo' }}
          </h5>
          <p class="text-muted small">Complete la información de los fármacos aplicados</p>
        </div>

        <form @submit.prevent="submitForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="label-premium">VACUNA REPRODUCTIVA *</label>
              <input v-model="form.reproductiveVaccine" class="form-control-premium"
                :class="{ 'is-invalid': errors.reproductiveVaccine }" placeholder="Ej: Bioabortogen" />
            </div>

            <div class="col-md-6">
              <label class="label-premium">SINCROGEST *</label>
              <input v-model="form.sincrogestProduct" class="form-control-premium"
                :class="{ 'is-invalid': errors.sincrogestProduct }" placeholder="Ej: Sincrogest Inyectable" />
            </div>

            <div class="col-md-6">
              <label class="label-premium">ANTIPARASITARIO *</label>
              <input v-model="form.antiparasiticProduct" class="form-control-premium"
                :class="{ 'is-invalid': errors.antiparasiticProduct }" placeholder="Ej: Ivermectina 1%" />
            </div>

            <div class="col-md-6">
              <label class="label-premium">FECHA DE APLICACIÓN *</label>
              <input type="date" v-model="form.applicationDate" class="form-control-premium"
                :class="{ 'is-invalid': errors.applicationDate }" />
            </div>

            <div class="col-12">
              <div class="switch-container-premium">
                <div class="form-check form-switch p-0 m-0 d-flex align-items-center justify-content-between">
                  <div>
                    <label class="fw-bold text-dark m-0" for="vitaminsSwitch">Vitaminas y Minerales</label>
                    <p class="text-muted small m-0">Marcar si se aplicó refuerzo nutricional</p>
                  </div>
                  <input class="form-check-input custom-switch" type="checkbox" role="switch" id="vitaminsSwitch"
                    v-model="form.vitaminsAndMinerals">
                </div>
              </div>
            </div>
          </div>

          <div class="d-flex gap-3 mt-5">
            <button class="btn btn-success-premium px-5" type="submit" :disabled="!isFormValid || isSaving">
              {{ isSaving ? 'GUARDANDO...' : (editing ? 'ACTUALIZAR DATOS' : 'GUARDAR PROTOCOLO') }}
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
import { PresynchronizationService } from '@/services/management/PresynchronizationService'
import { Presynchronization } from '@/model/management/Presynchronization'
import { useSessionPropertyStore } from '@/store/SessionProperty'

const service = new PresynchronizationService()
const sessionPropertyStore = useSessionPropertyStore()

const item = ref(null)
const isSaving = ref(false)
const loadingText = ref('Sincronizando...')
const showForm = ref(false)
const editing = ref(false)

const form = ref({
  id: null,
  reproductiveVaccine: '',
  sincrogestProduct: '',
  antiparasiticProduct: '',
  vitaminsAndMinerals: true,
  applicationDate: new Date().toISOString().split('T')[0]
})

const errors = ref({
  reproductiveVaccine: false,
  sincrogestProduct: false,
  antiparasiticProduct: false,
  applicationDate: false
})

/* =========================
   UI HELPERS (TOAST)
========================= */
function showToast(message, type = 'success') {
  const toastEl = document.getElementById('liveToast');
  if (toastEl) {
    toastEl.className = `toast align-items-center border-0 shadow-lg text-white bg-${type === 'success' ? 'success' : 'danger'}`;
    const msgEl = document.getElementById('toast-message');
    if (msgEl) msgEl.textContent = message;
    new Toast(toastEl).show();
  }
}

watch(() => form.value, () => {
  errors.value.reproductiveVaccine = !form.value.reproductiveVaccine
  errors.value.sincrogestProduct = !form.value.sincrogestProduct
  errors.value.antiparasiticProduct = !form.value.antiparasiticProduct
  errors.value.applicationDate = !form.value.applicationDate
}, { deep: true })

const isFormValid = computed(() => {
  return (
    !!form.value.reproductiveVaccine && !!form.value.sincrogestProduct &&
    !!form.value.antiparasiticProduct && !!form.value.applicationDate
  )
})

async function loadItem() {
  loadingText.value = 'Cargando datos de pre-sincronización...'
  try {
    const response = await service.get(sessionPropertyStore.getControlBovineId)
    item.value = response || null
  } catch (error) {
    item.value = null
    showToast('Error al cargar los datos.', 'danger')
  }
}

function openAddForm() {
  editing.value = false
  form.value = {
    id: null, reproductiveVaccine: '', sincrogestProduct: '',
    antiparasiticProduct: '', vitaminsAndMinerals: true,
    applicationDate: new Date().toISOString().split('T')[0]
  }
  showForm.value = true
}

function openEditForm() {
  editing.value = true
  // Mapeamos lo que viene del item (que usa camelCase por el fromJson del modelo) al form
  form.value = { ...item.value }
  showForm.value = true
}

function cancelForm() { showForm.value = false }

async function submitForm() {
  if (!isFormValid.value) return
  isSaving.value = true
  try {
    // INSTANCIACIÓN DEL MODELO
    const dataToSave = new Presynchronization({
      ...form.value,
      controlBovineId: sessionPropertyStore.getControlBovineId
    })

    if (editing.value) {
      await service.update(form.value.id, dataToSave)
      showToast('Presincronización actualizada correctamente.')
    } else {
      await service.create(dataToSave)
      showToast('Presincronización registrada correctamente.')
    }
    await loadItem()
    showForm.value = false
  } catch (error) {
    showToast('Ocurrió un error al guardar.', 'danger')
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  if (sessionPropertyStore.onScanned) {
    loadItem()
  }
});
</script>

<style scoped>
/* Los estilos se mantienen igual que en tu diseño original */
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

.icon-badge-premium.highlight {
  background: #16a34a;
  color: white;
}

.product-item-premium {
  padding: 12px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  display: flex;
  flex-direction: column;
}

.product-category {
  font-size: 0.65rem;
  font-weight: 800;
  color: #94a3b8;
  text-transform: uppercase;
}

.product-name {
  font-weight: 700;
  color: #1e293b;
  font-size: 0.9rem;
}

.vitamin-badge-on {
  padding: 8px 16px;
  background: #dcfce7;
  color: #15803d;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
}

.vitamin-badge-off {
  padding: 8px 16px;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 10px;
  font-weight: 700;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
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
  color: #1e293b;
}

.switch-container-premium {
  background: #f8fafc;
  padding: 16px;
  border-radius: 14px;
  border: 1px solid #f1f5f9;
}

.label-premium {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  margin-bottom: 8px;
  display: block;
}

.value-premium {
  font-weight: 600;
  color: #1e293b;
  font-size: 1.1rem;
}

.btn-success-premium {
  background: #2d4a22;
  color: #c0da63;
  border: none;
  padding: 14px 28px;
  border-radius: 14px;
  font-weight: 700;
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
}

.premium-divider {
  height: 1px;
  background: #f1f5f9;
  margin: 20px 0;
}
</style>