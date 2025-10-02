<template>
  <div class="property-card-container">
    <!-- Loader de carga -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner-border text-success" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
      <p class="mt-3 text-success">Entrando a la propiedad...</p>
    </div>

    <!-- Tarjeta para crear nueva propiedad -->
    <div class="add-property-card" @click="openAddPropertyModal">
      <button class="btn btn-outline-success new-property-btn">
        <i class="fas fa-plus-circle me-2"></i>Añadir Nueva Propiedad
      </button>
    </div>

    <!-- Tarjetas de propiedades -->
    <div class="property-card" v-for="prop in properties" :key="prop.id">
      <div class="property-info">
        <h2 class="property-name">
          {{ prop.name }}
          <span class="ms-2">
            <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 20C12 14 7 13 7 7" stroke="#388E3C" stroke-width="2" stroke-linecap="round" />
              <path d="M12 20C12 14 17 13 17 7" stroke="#388E3C" stroke-width="2" stroke-linecap="round" />
              <ellipse cx="7" cy="7" rx="1.2" ry="2" fill="#C8E6C9" />
              <ellipse cx="17" cy="7" rx="1.2" ry="2" fill="#C8E6C9" />
              <ellipse cx="9" cy="10" rx="1" ry="1.6" fill="#A5D6A7" />
              <ellipse cx="15" cy="10" rx="1" ry="1.6" fill="#A5D6A7" />
            </svg>
          </span>
        </h2>
        <p><i class="fas fa-map-marker-alt text-success me-2"></i><strong>Lugar:</strong> {{ prop.place }}</p>
        <p><i class="fas fa-user text-success me-2"></i><strong>Dueño:</strong> {{ prop.owner_name }}</p>
        <p><i class="fas fa-phone text-success me-2"></i><strong>Teléfono:</strong> {{ prop.phone_number }}</p>
      </div>
      <div class="d-flex gap-2 w-100">
        <button class="btn btn-success flex-fill" @click="startWork(prop)">
          <i class="fas fa-play-circle me-2"></i>Iniciar trabajo
        </button>
        <button class="btn btn-outline-danger flex-fill" @click="deleteProperty(prop)">
          <i class="fas fa-trash me-2"></i>Eliminar
        </button>
      </div>
    </div>

    <!-- Modal para crear nueva propiedad -->
    <div class="modal fade" id="createPropertyModal" tabindex="-1" aria-labelledby="createPropertyModalLabel"
      aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered modal-fadein">
        <div class="modal-content border-success shadow-green">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title" id="createPropertyModalLabel">
              <i class="fas fa-home me-2"></i>Nueva Propiedad
            </h5>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProperty">
              <div class="mb-3">
                <label class="form-label"><i class="fas fa-signature me-2 text-success"></i>Nombre</label>
                <input type="text" class="form-control" v-model="newProperty.name" @input="debouncedCheckName">
                <div v-if="nameExists" class="form-text text-danger">El nombre ya existe</div>
              </div>
              <div class="mb-3">
                <label class="form-label"><i class="fas fa-map-marker-alt me-2 text-success"></i>Lugar</label>
                <input type="text" class="form-control" v-model="newProperty.place">
              </div>
              <div class="mb-3">
                <label class="form-label"><i class="fas fa-user me-2 text-success"></i>Dueño</label>
                <input type="text" class="form-control" v-model="newProperty.owner_name">
              </div>
              <div class="mb-3">
                <label class="form-label"><i class="fas fa-phone me-2 text-success"></i>Teléfono</label>
                <input type="text" class="form-control" v-model="newProperty.phone_number">
              </div>
              <button type="submit" class="btn btn-success w-100" :disabled="!isFormValid">
                <i class="fas fa-save me-2"></i>Guardar Propiedad
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="modal fade" id="deleteConfirmationModal" tabindex="-1" aria-labelledby="deleteConfirmationModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-danger shadow-red">
                <div class="modal-header bg-danger text-white">
                    <h5 class="modal-title" id="deleteConfirmationModalLabel">
                        <i class="fas fa-exclamation-triangle me-2"></i> Confirmar Eliminación
                    </h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <p v-if="propertyToDelete">
                        Estás a punto de eliminar la propiedad **{{ propertyToDelete.name }}**.
                        <br>
                        <strong class="text-danger">Esta acción es irreversible. ¿Confirmas la eliminación?</strong>
                    </p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                        <i class="fas fa-times me-2"></i> Cancelar
                    </button>
                    <button type="button" class="btn btn-danger" @click="confirmDelete">
                        <i class="fas fa-trash me-2"></i> Sí, Eliminar
                    </button>
                </div>
            </div>
        </div>
    </div>

  </div>
</template>


<script>
import PropertyService from '../services/management/PropertyService';
import { ref, onMounted, computed } from 'vue';
import { Modal } from 'bootstrap';
import { useNavigation } from '@/utils/navigation';

export default {
  name: "SelectProperty",
  setup(_, { emit }) {
    const properties = ref([]);
    const loading = ref(false);
    const { replaceTo } = useNavigation();

    const newProperty = ref({
      name: '',
      place: '',
      owner_name: '',
      phone_number: '',
      user_id: 1
    });
    const nameExists = ref(false);
  // NUEVO: Para almacenar la propiedad a eliminar y controlar el modal
    const propertyToDelete = ref(null); 
    
    // Referencia a la instancia del modal de eliminación para controlarlo
    let deleteModalInstance = null;
    const loadProperties = async () => {
      try {
        properties.value = await PropertyService.list();
      } catch (error) {
        console.error('Error cargando propiedades:', error);
      }
    };

    const startWork = (prop) => {
      emit('start-work', prop);
      loading.value = true;
      setTimeout(() => {
        replaceTo({ name: "dashboard" })
      }, 5000);
      //redirige a esta pantalla con este nombre dashboard
    };

    const openAddPropertyModal = () => {
      nameExists.value = false;
      newProperty.value = { name: '', place: '', owner_name: '', phone_number: '' ,user_id:1};
      const modal = new Modal(document.getElementById('createPropertyModal'));
      modal.show();
    };

    let debounceTimeout;
    const debouncedCheckName = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(checkNameExists, 400);
    };

    const checkNameExists = async () => {
      if (!newProperty.value.name) return;
      try {
        nameExists.value = await PropertyService.nameExists(newProperty.value.name);
      } catch (error) {
        console.error('Error verificando nombre:', error);
      }
    };

    const saveProperty = async () => {
      if (!isFormValid.value) return;
      try {
        console.log(newProperty.value);
        const created = await PropertyService.create(newProperty.value);
        properties.value.push(created);
        const modalEl = document.getElementById('createPropertyModal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
      } catch (error) {
        console.error('Error creando propiedad:', error);
      }
    };

    const deleteProperty = async (prop) => {
   propertyToDelete.value = prop;
      if (!deleteModalInstance) {
        // Inicializa la instancia de Bootstrap Modal la primera vez
        deleteModalInstance = new Modal(document.getElementById('deleteConfirmationModal'));
      }
      deleteModalInstance.show();
    };
    const confirmDelete = async () => {
      if (!propertyToDelete.value) return;

      try {
        await PropertyService.delete(propertyToDelete.value.id);
        
        // Actualiza la lista
        properties.value = properties.value.filter(p => p.id !== propertyToDelete.value.id);
        
        // Cierra el modal
        deleteModalInstance.hide();
        
        console.log(`Propiedad "${propertyToDelete.value.name}" eliminada.`);
        propertyToDelete.value = null; // Limpia el estado
        
      } catch (error) {
        console.error('Error eliminando propiedad:', error);
        alert('Hubo un error al intentar eliminar la propiedad.'); // Usa alerta si falla la API
      }
    };


    const isFormValid = computed(() => {
      return newProperty.value.name &&
        newProperty.value.place &&
        newProperty.value.owner_name &&
        newProperty.value.phone_number &&
        !nameExists.value;
    });

    onMounted(loadProperties);

    return {
      properties,
      newProperty,
      nameExists,
      startWork,
      openAddPropertyModal,
      saveProperty,
      debouncedCheckName,
      isFormValid,
      deleteProperty, 
      confirmDelete, 
      loading
    };
  }
};
</script>

<style scoped>
.property-card-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  padding: 2rem;
}

/* Tarjetas */
.property-card,
.add-property-card {
  min-width: 300px;
  max-width: 380px;
  width: 100%;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease-in-out;
}

.property-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.3);
}

/* Animación modal */
.modal-fadein {
  animation: fadeInUp 0.4s ease;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Sombra verde para modal */
.shadow-green {
  box-shadow: 0 8px 32px rgba(56, 142, 60, 0.4);
  border: 2px solid #4caf50;
}

.property-info {
  width: 100%;
  margin-bottom: 1.5rem;
}

.property-name {
  font-size: 1.6rem;
  margin-bottom: 0.5rem;
  color: #2d5c2d;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.start-btn {
  padding: 0.8rem 1.6rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

/* Botón añadir */
.add-property-card {
  border: 2px dashed #81c784;
  background: #f1f8f4;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.add-property-card:hover {
  background: #e8f5e9;
  border-color: #2d5c2d;
}

.new-property-btn {
  background: transparent;
  color: #2d5c2d;
  font-size: 1.1rem;
  padding: 1rem 2rem;
}

.new-property-btn:hover {
  color: #1e3e1e;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
</style>
