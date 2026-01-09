<template>
  <div class="property-card-container">

    <div v-if="toast.show" class="toast-overlay animate__animated animate__fadeInRight">
      <div :class="['custom-toast shadow-lg', toast.typeClass]">
        <div class="d-flex align-items-center gap-3">
          <i :class="[toast.icon, 'fs-4']"></i>
          <div class="fw-bold">{{ toast.message }}</div>
          <button class="btn-close btn-close-white ms-auto" @click="toast.show = false"></button>
        </div>
      </div>
    </div>

    <div class="top-actions">
      <button class="btn btn-logout shadow-sm" @click="openLogoutModal">
        <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
      </button>
    </div>

    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-success" role="status"></div>
      <p class="mt-3 text-success fw-bold">{{ loadingText }}</p>
    </div>

    <div class="add-property-card shadow-sm animate__animated animate__fadeIn" @click="openPropertyModal()">
      <div class="text-center">
        <div class="plus-icon-circle mb-3">
          <i class="fas fa-plus"></i>
        </div>
        <p class="m-0 fw-bold text-success">Añadir Propiedad</p>
      </div>
    </div>

    <div v-for="prop in properties" :key="prop.id" class="property-card shadow-sm animate__animated animate__fadeIn"
      :class="{ 'card-active': selectedPropertyId === prop.id }">

      <div class="property-header" @click="togglePropertyControls(prop.id)">
        <div class="d-flex justify-content-between align-items-start mb-3">
          <h2 class="property-name text-truncate">{{ prop.name }}</h2>
          <div class="d-flex gap-1">
            <button class="btn btn-edit-mini" @click.stop="openPropertyModal(prop)">
              <i class="fas fa-pen"></i>
            </button>
            <div class="chevron-box" :class="{ 'rotated': selectedPropertyId === prop.id }">
              <i class="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

        <div class="property-details">
          <div class="detail-row">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ prop.place }}</span>
          </div>
          <div class="detail-row">
            <i class="fas fa-user"></i>
            <span>{{ prop.owner_name }}</span>
          </div>
          <div class="detail-row">
            <i class="fas fa-phone"></i>
            <span>{{ prop.phone_number }}</span>
          </div>
        </div>
      </div>

      <div v-if="selectedPropertyId === prop.id" class="controls-drawer animate__animated animate__fadeIn">
        <div class="drawer-divider"></div>

        <div class="d-flex justify-content-between align-items-center mb-3">
          <span class="gestion-badge">GESTIONES DISPONIBLES</span>
          <button class="btn btn-add-control" @click="openControlModal()">
            <i class="fas fa-calendar-plus me-1"></i> Nueva
          </button>
        </div>

        <div v-if="controlsLoading" class="text-center py-4">
          <div class="spinner-border spinner-border-sm text-success"></div>
        </div>

        <div v-else class="controls-list custom-scroll">
          <div v-if="controls.length === 0" class="no-data-text">No hay periodos de gestión registrados.</div>

          <div v-for="control in controls" :key="control.id" class="control-item-wrapper mb-2">
            <div class="control-item-btn" :class="{ 'selected': selectedControlId === control.id }"
              @click="selectedControlId = control.id">
              <div class="d-flex justify-content-between align-items-center w-100">
                <div class="text-start">
                  <div class="control-date-main">{{ formatDate(control.startDate) }}</div>
                  <div class="control-date-sub">Vence: {{ formatDate(control.endDate) }}</div>
                </div>
                <div class="d-flex gap-2 align-items-center">
                  <button class="btn-sub-action edit" @click.stop="openControlModal(control)">
                    <i class="fas fa-edit"></i>
                  </button>
                  <button v-if="selectedControlId !== control.id" class="btn-sub-action delete"
                    @click.stop="confirmDelete('control', control.id)">
                    <i class="fas fa-trash"></i>
                  </button>
                  <i v-if="selectedControlId === control.id" class="fas fa-check-circle fs-5 text-white"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="card-footer-actions mt-3">
          <button class="btn btn-start-work w-100 shadow-sm" :disabled="!selectedControlId"
            @click="handleStartWork(prop.id, prop.name, prop.place, prop.phone_number, prop.owner_name)">
            <i class="fas fa-play-circle me-2"></i>INICIAR TRABAJO
          </button>
          <button class="btn btn-delete-prop w-100" @click="confirmDelete('property', prop)">
            <i class="fas fa-trash-alt me-2"></i>Eliminar Propiedad
          </button>
        </div>
      </div>
    </div>

    <div class="modal fade" id="propertyModal" tabindex="-1" data-bs-backdrop="static">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header-premium bg-success d-flex justify-content-between align-items-center">
            <h5 class="m-0 text-white fw-bold">{{ isEditingProperty ? 'Editar Propiedad' : 'Nueva Propiedad' }}</h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label-premium">NOMBRE DE LA PROPIEDAD</label>
              <input type="text" class="form-control-premium" v-model="propertyForm.name"
                :class="{ 'is-invalid': nameExistsError }">
              <div v-if="nameExistsError" class="invalid-feedback">Este nombre ya se encuentra registrado.</div>
            </div>
            <div class="mb-3">
              <label class="form-label-premium">UBICACIÓN / LUGAR</label>
              <input type="text" class="form-control-premium" v-model="propertyForm.place">
            </div>
            <div class="row g-3">
              <div class="col-8">
                <label class="form-label-premium">DUEÑO</label>
                <input type="text" class="form-control-premium" v-model="propertyForm.owner_name">
              </div>
              <div class="col-4">
                <label class="form-label-premium">TELÉFONO</label>
                <input type="text" class="form-control-premium" v-model="propertyForm.phone_number">
              </div>
            </div>
            <button class="btn btn-success-premium w-100 mt-4" :disabled="!isPropertyFormValid" @click="submitProperty">
              {{ isEditingProperty ? 'ACTUALIZAR DATOS' : 'GUARDAR PROPIEDAD' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="controlModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg rounded-4 overflow-hidden">
          <div class="modal-header-premium bg-success d-flex justify-content-between align-items-center">
            <h6 class="m-0 text-white fw-bold">Periodo de Gestión</h6>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
          </div>
          <div class="modal-body p-4">
            <div class="mb-3">
              <label class="form-label-premium">FECHA INICIO</label>
              <input type="date" class="form-control-premium" v-model="controlForm.startDate">
            </div>
            <div class="mb-3">
              <label class="form-label-premium">FECHA FIN ESTIMADA</label>
              <input type="date" class="form-control-premium" v-model="controlForm.endDate">
            </div>
            <div v-if="controlFormError" class="alert alert-warning py-2 small border-0">{{ controlFormError }}</div>
            <button class="btn btn-success-premium w-100 mt-2" :disabled="!isControlFormValid"
              @click="submitControl">ESTABLECER GESTIÓN</button>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="confirmDeleteModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg rounded-4">
          <div class="modal-body text-center p-4">
            <div class="icon-delete-circle mb-3"><i class="fas fa-trash-alt"></i></div>
            <h5 class="fw-bold text-dark">¿Confirmar eliminación?</h5>
            <p class="text-muted small">Esta acción eliminará permanentemente el registro seleccionado.</p>
            <div class="d-grid gap-2 mt-4">
              <button class="btn btn-danger-premium py-2" @click="executeDelete">SÍ, ELIMINAR</button>
              <button class="btn btn-light-premium" data-bs-dismiss="modal">CANCELAR</button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="modal fade" id="logoutModal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered modal-sm">
        <div class="modal-content border-0 shadow-lg rounded-custom-28 overflow-hidden">
          <div class="bg-dark-gradient"
            style="height: 90px; display: flex; align-items: center; justify-content: center; position: relative; background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);">
            <div
              style="width: 66px; height: 66px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.6rem; color: #1e293b; position: absolute; bottom: -33px; box-shadow: 0 10px 15px rgba(0,0,0,0.1);">
              <i class="fas fa-sign-out-alt"></i>
            </div>
          </div>

          <div class="modal-body p-4 pt-5 text-center">
            <h5 class="fw-bold text-dark mt-2">Cerrar Sesión</h5>
            <p class="text-muted small">¿Estás seguro que deseas salir de la aplicación?</p>
            <div class="d-grid gap-2 mt-4">
              <button class="btn btn-dark-premium py-2" @click="executeLogout">CERRAR SESIÓN</button>
              <button class="btn btn-light-premium" data-bs-dismiss="modal">CANCELAR</button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* --- CONFIGURACIÓN BASE --- */
.property-card-container {
  padding: 6rem 2rem 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
  background-color: #f8fafc;
  min-height: 100vh;
  position: relative;
}

/* --- TOASTS --- */
.toast-overlay {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 10000;
  min-width: 320px;
}

.custom-toast {
  padding: 1.25rem;
  border-radius: 16px;
  color: white;
  display: flex;
  align-items: center;
}

.toast-success {
  background: #10b981;
}

.toast-error {
  background: #ef4444;
}

.toast-warning {
  background: #f59e0b;
}

/* --- CARGA --- */
.loading-overlay {
  position: fixed;
  inset: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 11000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
}

/* --- BOTONES SUPERIORES --- */
.top-actions {
  position: absolute;
  top: 1.5rem;
  right: 2rem;
}

.btn-logout {
  background: #e11d48;
  color: #ffffff;
  border: 1px solid #e11d48;
  padding: 8px 20px;
  border-radius: 12px;
  font-weight: 700;
  transition: 0.3s;
}

.btn-logout:hover {
  background: #be123c;
  border-color: #be123c;
  color: #ffffff;
}

/* --- CARD AÑADIR --- */
.add-property-card {
  height: 230px;
  border: 3px dashed #cbd5e1;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background: white;
  transition: 0.3s ease;
}

.add-property-card:hover {
  border-color: #10b981;
  transform: translateY(-5px);
  background: #f0fdf4;
}

.plus-icon-circle {
  width: 50px;
  height: 50px;
  background: #f0fdf4;
  color: #10b981;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin: 0 auto;
}

/* --- CARD PROPIEDAD --- */
.property-card {
  background: white;
  border-radius: 24px;
  border: 2px solid transparent;
  transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  height: fit-content;
  overflow: hidden;
}

.card-active {
  border-color: #10b981;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
}

.property-header {
  padding: 1.5rem;
  cursor: pointer;
}

.property-name {
  font-size: 1.4rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0;
}

.chevron-box {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #94a3b8;
  transition: 0.3s;
}

.chevron-box.rotated {
  transform: rotate(180deg);
  color: #10b981;
}

.detail-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
  color: #64748b;
  font-size: 0.9rem;
}

.detail-row i {
  color: #10b981;
  width: 16px;
}

/* --- CONTROLES / GESTIONES --- */
.controls-drawer {
  padding: 0 1.5rem 1.5rem;
}

.drawer-divider {
  height: 2px;
  background: #f1f5f9;
  margin-bottom: 1.5rem;
}

.gestion-badge {
  font-size: 0.65rem;
  font-weight: 800;
  color: #94a3b8;
  letter-spacing: 1px;
}

.btn-add-control {
  background: #ecfdf5;
  color: #059669;
  border: none;
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 700;
}

.controls-list {
  max-height: 200px;
  overflow-y: auto;
  padding-right: 8px;
}

.no-data-text {
  text-align: center;
  padding: 20px;
  font-size: 0.8rem;
  color: #94a3b8;
  font-style: italic;
}

.control-item-btn {
  width: 100%;
  padding: 12px;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: 0.2s;
}

.control-item-btn.selected {
  background: #10b981;
  border-color: #10b981;
  color: white;
}

.control-date-main {
  font-weight: 700;
  font-size: 0.95rem;
}

.control-date-sub {
  font-size: 0.75rem;
  opacity: 0.8;
}

.btn-sub-action {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  transition: 0.2s;
}

.control-item-btn.selected .btn-sub-action {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.control-item-btn:not(.selected) .edit {
  background: #eff6ff;
  color: #2563eb;
}

.control-item-btn:not(.selected) .delete {
  background: #fff1f2;
  color: #e11d48;
}

/* --- ACCIONES FOOTER --- */
.btn-start-work {
  background: #1e293b;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 16px;
  font-weight: 700;
  transition: 0.3s;
}

.btn-start-work:not(:disabled):hover {
  background: #0f172a;
  transform: scale(1.02);
}

.btn-delete-prop {
  background: transparent;
  color: #94a3b8;
  border: none;
  font-size: 0.8rem;
  font-weight: 600;
  margin-top: 10px;
}

.btn-delete-prop:hover {
  color: #e11d48;
}

/* --- MODALES PREMIUM --- */
.modal-header-premium {
  padding: 1.5rem;
  border: none;
}

.form-label-premium {
  font-size: 0.7rem;
  font-weight: 800;
  color: #94a3b8;
  margin-bottom: 8px;
}

.form-control-premium {
  width: 100%;
  padding: 12px;
  border: 2px solid #f1f5f9;
  border-radius: 12px;
  font-weight: 600;
  transition: 0.3s;
}

.form-control-premium:focus {
  border-color: #10b981;
  outline: none;
}

.btn-success-premium {
  background: #10b981;
  color: white;
  border: none;
  padding: 14px;
  border-radius: 14px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.2);
}

.icon-delete-circle,
.icon-logout-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 1.5rem;
}

.icon-delete-circle {
  background: #fff1f2;
  color: #e11d48;
}

.icon-logout-circle {
  background: #f1f5f9;
  color: #1e293b;
}

.btn-danger-premium {
  background: #e11d48;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
}

.btn-dark-premium {
  background: #1e293b;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 700;
}

.btn-light-premium {
  background: #f1f5f9;
  color: #64748b;
  border: none;
  border-radius: 12px;
  font-weight: 700;
}

/* SCROLLBAR */
.custom-scroll::-webkit-scrollbar {
  width: 5px;
}

.custom-scroll::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>

<script>
import { ref, onMounted, computed, reactive } from 'vue';
import { Modal } from 'bootstrap';
import { useSessionPropertyStore } from '@/store/SessionProperty';
import { useNavigation } from '@/utils/navigation';
import PropertyService from '@/services/management/PropertyService';
import ControlService from '@/services/management/ControlService';
import Control from '@/model/management/Control';

export default {
  name: "SelectProperty",
  setup() {
    const properties = ref([]);
    const controls = ref([]);
    const loading = ref(false);
    const loadingText = ref('Cargando...');
    const controlsLoading = ref(false);
    const selectedPropertyId = ref(null);
    const selectedControlId = ref(null);
    const deleteTarget = ref({ type: '', id: null });

    const sessionStore = useSessionPropertyStore();
    const { replaceTo } = useNavigation();
    const propertyService = new PropertyService();

    // TOAST STATE
    const toast = reactive({ show: false, message: '', typeClass: '', icon: '' });
    const showToast = (type, message) => {
      toast.message = message;
      toast.show = true;
      if (type === 'success') {
        toast.typeClass = 'toast-success';
        toast.icon = 'fas fa-check-circle';
      } else if (type === 'error') {
        toast.typeClass = 'toast-error';
        toast.icon = 'fas fa-times-circle';
      } else {
        toast.typeClass = 'toast-warning';
        toast.icon = 'fas fa-exclamation-triangle';
      }
      setTimeout(() => { toast.show = false; }, 3500);
    };

    const propertyForm = ref({ id: null, name: '', place: '', owner_name: '', phone_number: '', user_id: sessionStore.getUser?.id });
    const isEditingProperty = ref(false);
    const controlForm = ref({ id: null, startDate: '', endDate: '' });
    const isEditingControl = ref(false);

    // VALIDACIONES
    const nameExistsError = computed(() => {
      if (isEditingProperty.value) return false;
      return properties.value.some(p => p.name.toLowerCase().trim() === propertyForm.value.name.toLowerCase().trim());
    });

    const isPropertyFormValid = computed(() => {
      const f = propertyForm.value;
      return !nameExistsError.value && f.name.trim() && f.place.trim() && f.owner_name.trim() && f.phone_number.trim();
    });

    const controlFormError = computed(() => {
      if (!controlForm.value.startDate || !controlForm.value.endDate) return "Defina las fechas.";
      const start = new Date(controlForm.value.startDate);
      const end = new Date(controlForm.value.endDate);
      if (end <= start) return "La fecha fin debe ser mayor.";
      const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24));
      return diffDays < 365 ? "Mínimo 365 días de gestión." : null;
    });

    const isControlFormValid = computed(() => controlFormError.value === null);

    // MÉTODOS PROPIEDAD
    const loadProperties = async () => {
      loadingText.value = "Obteniendo propiedades...";
      loading.value = true;
      try { properties.value = await propertyService.list(); }
      catch (e) { showToast('error', 'Error al cargar propiedades'); }
      finally { loading.value = false; }
    };

    const togglePropertyControls = async (propId) => {
      if (selectedPropertyId.value === propId) { selectedPropertyId.value = null; return; }
      selectedPropertyId.value = propId;
      selectedControlId.value = null;
      controlsLoading.value = true;
      try { controls.value = await ControlService.getByProperty(propId); }
      catch (e) { showToast('error', 'Error al cargar gestiones'); }
      finally { controlsLoading.value = false; }
    };

    const openPropertyModal = (prop = null) => {
      isEditingProperty.value = !!prop;
      propertyForm.value = prop ? { ...prop } : { id: null, name: '', place: '', owner_name: '', phone_number: '', user_id: sessionStore.getUser?.id };
      new Modal(document.getElementById('propertyModal')).show();
    };

    const submitProperty = async () => {
      loadingText.value = isEditingProperty.value ? "Actualizando datos..." : "Guardando nueva propiedad...";
      loading.value = true;
      try {
        if (isEditingProperty.value) {
          const updated = await propertyService.update(propertyForm.value.id, propertyForm.value);
          const index = properties.value.findIndex(p => p.id === updated.id);
          properties.value[index] = updated;
          showToast('success', 'Propiedad actualizada');
        } else {
          const created = await propertyService.create(propertyForm.value);
          properties.value.push(created);
          showToast('success', 'Propiedad creada con éxito');
        }
        Modal.getInstance(document.getElementById('propertyModal')).hide();
      } catch (e) {
        showToast('error', 'Error al procesar propiedad');
      } finally {
        loading.value = false;
      }
    };

    // MÉTODOS GESTIÓN
    const openControlModal = (ctrl = null) => {
      isEditingControl.value = !!ctrl;
      controlForm.value = ctrl ? { ...ctrl } : { id: null, startDate: '', endDate: '' };
      new Modal(document.getElementById('controlModal')).show();
    };

    const submitControl = async () => {
      loadingText.value = "Registrando gestión...";
      loading.value = true;
      try {
        if (isEditingControl.value) {
          const ctrl = new Control({ id: controlForm.value.id, propertyId: selectedPropertyId.value, startDate: controlForm.value.startDate, endDate: controlForm.value.endDate });
          const updated = await ControlService.update(ctrl);
          const index = controls.value.findIndex(c => c.id === updated.id);
          controls.value[index] = updated;
          showToast('success', 'Gestión editada');
        } else {
          const created = await ControlService.create(selectedPropertyId.value, controlForm.value.startDate, controlForm.value.endDate);
          controls.value.unshift(created);
          showToast('success', 'Nueva gestión creada');
        }
        Modal.getInstance(document.getElementById('controlModal')).hide();
      } catch (e) {
        showToast('error', 'Error al procesar gestión');
      } finally {
        loading.value = false;
      }
    };

    // BORRADO
    const confirmDelete = (type, data) => {
      deleteTarget.value = { type, id: type === 'control' ? data : data.id };
      new Modal(document.getElementById('confirmDeleteModal')).show();
    };

    const executeDelete = async () => {
      const { type, id } = deleteTarget.value;
      Modal.getInstance(document.getElementById('confirmDeleteModal')).hide();
      loadingText.value = "Eliminando registro...";
      loading.value = true;
      try {
        if (type === 'property') {
          await propertyService.delete(id);
          properties.value = properties.value.filter(p => p.id !== id);
          showToast('success', 'Propiedad eliminada');
        } else {
          await ControlService.delete(id);
          controls.value = controls.value.filter(c => c.id !== id);
          showToast('success', 'Gestión eliminada');
        }
      } catch (e) {
        showToast('error', 'No se pudo eliminar el registro');
      } finally {
        loading.value = false;
      }
    };

    // LOGOUT
    const openLogoutModal = () => {
      new Modal(document.getElementById('logoutModal')).show();
    };

    const executeLogout = async () => {
      Modal.getInstance(document.getElementById('logoutModal')).hide();
      loadingText.value = "Finalizando sesión...";
      loading.value = true;
      try {
        await sessionStore.logout();
        replaceTo('login');
      } catch (e) {
        loading.value = false;
      }
    };

    const handleStartWork = async (propId, name, place, phone, owner) => {
      loadingText.value = "Iniciando trabajo en la propiedad...";
      loading.value = true;
      try {
        console.log("Iniciando trabajo en la propiedad:", name);
  
        await sessionStore.startWork(propId, selectedControlId.value, name, place, phone, owner);
        replaceTo('dashboard');
      } catch (e) {
        console.error('Error starting work:', e);
        showToast('error', 'No se pudo iniciar el trabajo');
        loading.value = false;
      }
    };

    const formatDate = (d) => d ? new Date(d).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : '---';

    onMounted(loadProperties);

    return {
      properties, controls, loading, loadingText, controlsLoading, selectedPropertyId, selectedControlId, toast,
      propertyForm, isEditingProperty, isPropertyFormValid, nameExistsError,
      controlForm, isEditingControl, controlFormError, isControlFormValid,
      openLogoutModal, executeLogout, togglePropertyControls, openControlModal, submitControl,
      handleStartWork, formatDate, openPropertyModal, submitProperty, confirmDelete, executeDelete
    };
  }
};
</script>
