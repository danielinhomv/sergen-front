<template>
  <div class="property-card-container">
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
        <p><strong>Lugar:</strong> {{ prop.place }}</p>
        <p><strong>Dueño:</strong> {{ prop.owner_name }}</p>
        <p><strong>Teléfono:</strong> {{ prop.phone_number }}</p>
      </div>
      <button class="start-btn btn btn-success" @click="startWork(prop)">
        Iniciar trabajo en esta propiedad
      </button>
    </div>

    <!-- Modal para crear nueva propiedad -->
    <div class="modal fade" id="createPropertyModal" tabindex="-1" aria-labelledby="createPropertyModalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content border-success">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title" id="createPropertyModalLabel">Nueva Propiedad</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <form @submit.prevent="saveProperty">
              <div class="mb-3">
                <label class="form-label">Nombre</label>
                <input type="text" class="form-control" v-model="newProperty.name" @input="debouncedCheckName">
                <div v-if="nameExists" class="form-text text-danger">El nombre ya existe</div>
              </div>
              <div class="mb-3">
                <label class="form-label">Lugar</label>
                <input type="text" class="form-control" v-model="newProperty.place">
              </div>
              <div class="mb-3">
                <label class="form-label">Dueño</label>
                <input type="text" class="form-control" v-model="newProperty.owner_name">
              </div>
              <div class="mb-3">
                <label class="form-label">Teléfono</label>
                <input type="text" class="form-control" v-model="newProperty.phone_number">
              </div>
              <button type="submit" class="btn btn-success w-100" :disabled="!isFormValid">Guardar Propiedad</button>
            </form>
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

export default {
  name: "SelectProperty",
  setup(_, { emit }) {
    const properties = ref([]);
    const newProperty = ref({
      name: '',
      place: '',
      owner_name: '',
      phone_number: ''
    });
    const nameExists = ref(false);

    const loadProperties = async () => {
      try {
        properties.value = await PropertyService.list();
      } catch (error) {
        console.error('Error cargando propiedades:', error);
      }
    };

    const startWork = (prop) => {
      emit('start-work', prop);
    };

    const openAddPropertyModal = () => {
      nameExists.value = false;
      newProperty.value = { name: '', place: '', owner_name: '', phone_number: '' , user_id:1};
      const modal = new Modal(document.getElementById('createPropertyModal'));
      modal.show();
    };

    // Debounce simple para no saturar la API
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
        const created = await PropertyService.create(newProperty.value);
        properties.value.push(created);
        const modalEl = document.getElementById('createPropertyModal');
        const modal = Modal.getInstance(modalEl);
        modal.hide();
      } catch (error) {
        console.error('Error creando propiedad:', error);
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
      isFormValid
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

.property-card,
.add-property-card {
  min-width: 300px;
  width: 100%;
  max-width: 380px;
  padding: 2rem;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: box-shadow 0.2s;
}

.property-card:hover {
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
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
  background: #2d5c2d;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
  width: 100%;
}

.start-btn:hover {
  background: #1e3e1e;
}

.add-property-card {
  border: 2px dashed #ccc;
  background: #f9f9f9;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.2s;
}

.add-property-card:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.12);
  border-color: #2d5c2d;
}

.new-property-btn {
  background: transparent;
  color: #2d5c2d;
  border: none;
  font-size: 1.1rem;
  padding: 1rem 2rem;
  width: auto;
}

.new-property-btn:hover {
  color: #1e3e1e;
}
</style>
