<template>
  <div class="bits-management-container">

    <h3>Gestión de Toros</h3>

    <!-- BOTÓN AGREGAR TORO -->
    <button class="btn btn-primary mb-3" @click="showAddInput = true" v-if="!showAddInput">
      Agregar Toro
    </button>

    <!-- INPUT PARA NUEVO TORO -->
    <div v-if="showAddInput" class="new-bull-input mb-2">
      <input v-model="newBullName" class="form-control me-2" placeholder="Nombre del toro">
      <button class="btn btn-success me-2" @click="addBull">✔</button>
      <button class="btn btn-secondary" @click="cancelAdd">✖</button>
      <div v-if="errorMessage" class="text-danger mt-1">{{ errorMessage }}</div>
    </div>

    <!-- LISTA DE TOROS -->
    <ul class="list-group">
      <li v-for="bull in bulls" :key="bull.id" class="list-group-item">
        {{ bull.name }}
      </li>
    </ul>

    <!-- LOADER ASÍNCRONO -->
    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner-container">
        <div class="pulsing-circle"></div>
      </div>
      <p class="loading-text">Cargando datos...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
// Suponemos que existe el servicio
import { BirthService } from '@/services/management/BirthService'

const birthService = new BirthService()

/* =========================
   STATE
========================= */
const bulls = ref([])
const showAddInput = ref(false)
const newBullName = ref('')
const errorMessage = ref('')
const isLoading = ref(false)

/* =========================
   LISTAR TOROS
========================= */
async function listBulls() {
  isLoading.value = true
  try {
    const response = await birthService.list() // suponemos endpoint list
    bulls.value = response.birth || []
  } catch (error) {
    console.error('Error listando toros:', error)
  } finally {
    isLoading.value = false
  }
}

/* =========================
   AGREGAR TORO
========================= */
async function addBull() {
  errorMessage.value = ''

  // Validar que no esté repetido
  const exists = bulls.value.some(b => b.name.toLowerCase() === newBullName.value.toLowerCase())
  if (exists) {
    errorMessage.value = 'Este nombre ya existe'
    return
  }

  // Llamada al backend
  isLoading.value = true
  try {
    await birthService.create({ name: newBullName.value })
    await listBulls()
    showAddInput.value = false
    newBullName.value = ''
  } catch (error) {
    errorMessage.value = 'Error al agregar toro'
    console.error(error)
  } finally {
    isLoading.value = false
  }
}

function cancelAdd() {
  showAddInput.value = false
  newBullName.value = ''
  errorMessage.value = ''
}

/* =========================
   LIFECYCLE
========================= */
onMounted(() => {
  listBulls()
})
</script>

<style scoped>
.bits-management-container {
  max-width: 500px;
  margin: 0 auto;
  padding: 2rem;
}

.new-bull-input {
  display: flex;
  align-items: center;
}

.list-group {
  margin-top: 1rem;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255,255,255,0.7);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.spinner-container {
  width: 80px;
  height: 80px;
  margin-bottom: 1rem;
}

.pulsing-circle {
  width: 80px;
  height: 80px;
  background-color: #388e3c;
  border-radius: 50%;
  opacity: 0.5;
  animation: pulse 2s infinite ease-out;
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: #388e3c;
}

@keyframes pulse {
  0% { transform: scale(0.6); opacity: 0.5; }
  50% { transform: scale(1.1); opacity: 0; }
  100% { transform: scale(0.6); opacity: 0.5; }
}
</style>
