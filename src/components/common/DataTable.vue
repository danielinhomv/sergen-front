<template>
  <div class="data-table-wrapper">
    <div class="table-controls p-3 d-flex justify-content-between align-items-center bg-white border-bottom">
      <div class="left-controls d-flex align-items-center gap-3">
        <div class="search-box">
          <i class="fas fa-search text-muted me-2"></i>
          <input v-model="searchQuery" type="text" placeholder="Buscar en registros..." class="form-control-clean">
        </div>

        <!-- Select para items por página -->
        <div class="items-selector">
          <label class="form-label mb-0 me-2" style="font-size: 0.85rem; color: #64748b;">Mostrar:</label>
          <select v-model="localItemsPerPage" @change="handleItemsPerPageChange" class="form-select form-select-sm">
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div class="table-meta" style="font-size: 1rem; color: #374151; font-weight: 500;">
        {{ filteredData.length }} resultados encontrados
      </div>
    </div>

    <div class="table-responsive">
      <table class="table-minimal">
        <thead>
          <tr>
            <th v-for="col in columns" :key="col.key" @click="sortBy(col.key)"
              :style="{ width: col.width || 'auto', cursor: 'pointer' }">
              {{ col.label }}
              <span v-if="sortKey === col.key" class="ms-1 text-primary">
                <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
              </span>
              <span v-else class="ms-1 text-muted opacity-25"><i class="fas fa-sort"></i></span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in paginatedData" :key="index" class="table-row">
            <td v-for="col in columns" :key="col.key">
              <slot :name="col.key" :row="row">
                {{ row[col.key] }}
              </slot>
            </td>
          </tr>
          <tr v-if="paginatedData.length === 0">
            <td :colspan="columns.length" class="text-center py-5 text-muted">
              No se encontraron datos coincidentes.
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="table-footer d-flex justify-content-between align-items-center p-3 bg-white border-top">
      <button class="btn-page" :disabled="currentPage === 1" @click="previousPage">
        <i class="fas fa-chevron-left"></i> Anterior
      </button>

      <span class="page-info">
        Página <strong>{{ currentPage }}</strong> de <strong>{{ totalPages || 1 }}</strong>
      </span>

      <button class="btn-page" :disabled="currentPage === totalPages || totalPages === 0" @click="nextPage">
        Siguiente <i class="fas fa-chevron-right"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps, defineEmits } from 'vue';

const props = defineProps({
  columns: { type: Array, required: true }, // [{ label: 'Nombre', key: 'name', width: '20%' }]
  data: { type: Array, required: true },
  itemsPerPage: { type: Number, default: 10 }
});

const emit = defineEmits(['update:items-per-page']);

const searchQuery = ref('');
const currentPage = ref(1);
const sortKey = ref('');
const sortOrder = ref('asc');
const localItemsPerPage = ref(props.itemsPerPage); // Local para select

// Watch para sincronizar props.itemsPerPage con local
watch(() => props.itemsPerPage, (newVal) => {
  localItemsPerPage.value = newVal;
});

// Emit y reset al cambiar items per page
const handleItemsPerPageChange = (event) => {
  const newValue = parseInt(event.target.value);
  localItemsPerPage.value = newValue;
  emit('update:items-per-page', newValue);
  currentPage.value = 1; // Reset a página 1
};

// 1. Filtrado
const filteredData = computed(() => {
  if (!searchQuery.value) return props.data;
  const lowerQuery = searchQuery.value.toLowerCase();

  return props.data.filter(row => {
    return Object.values(row).some(val =>
      String(val).toLowerCase().includes(lowerQuery)
    );
  });
});

// 2. Ordenamiento
const sortedData = computed(() => {
  let data = [...filteredData.value];
  if (sortKey.value) {
    data.sort((a, b) => {
      let valA = a[sortKey.value];
      let valB = b[sortKey.value];

      // Manejo de nulos y strings
      if (valA == null) valA = '';
      if (valB == null) valB = '';
      valA = String(valA).toLowerCase();
      valB = String(valB).toLowerCase();

      if (valA < valB) return sortOrder.value === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder.value === 'asc' ? 1 : -1;
      return 0;
    });
  }
  return data;
});

// 3. Paginación fija (garantiza exactamente itemsPerPage, menos en última)
const totalPages = computed(() => {
  return Math.ceil(sortedData.value.length / localItemsPerPage.value);
});

const paginatedData = computed(() => {
  const startIndex = (currentPage.value - 1) * localItemsPerPage.value;
  const endIndex = startIndex + localItemsPerPage.value;
  return sortedData.value.slice(startIndex, endIndex); // endIndex no inclusivo, fija a itemsPerPage
});

// Resetear página al buscar o cambiar items
watch(searchQuery, () => {
  currentPage.value = 1;
});

watch(localItemsPerPage, () => {
  currentPage.value = 1;
});

// Funciones para botones (evita saltos)
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

function sortBy(key) {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortKey.value = key;
    sortOrder.value = 'asc';
  }
  currentPage.value = 1; // Reset al ordenar
}
</script>

<style scoped>
.data-table-wrapper {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
}

/* Controles superiores */
.table-controls {
  background: #f8fafc !important;
  border-bottom: 1px solid #e2e8f0 !important;
}

.left-controls {
  gap: 16px;
}

/* Buscador */
.form-control-clean {
  border: none;
  outline: none;
  font-size: 0.9rem;
  width: 250px;
  color: #334155;
  background: transparent;
}

.search-box {
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  transition: all 0.2s;
  background: white;
}

.search-box:focus-within {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* Select items per page */
.items-selector {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
}

.items-selector .form-select {
  min-width: 80px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.85rem;
}

/* Meta resultados (más grande y oscuro) */
.table-meta {
  font-size: 1rem !important;
  color: #374151 !important;
  font-weight: 500 !important;
}

/* Tabla Minimalista */
.table-minimal {
  width: 100%;
  border-collapse: collapse;
}

.table-minimal th {
  background: #1e293b !important;
  /* Más oscuro como pediste */
  color: white !important;
  padding: 1rem 1.5rem;
  text-align: left;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border-bottom: 2px solid #334155;
  letter-spacing: 0.05em;
  user-select: none;
}

.table-minimal td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f1f5f9;
  vertical-align: middle;
  font-size: 0.9rem;
  color: #334155;
}

.table-row:hover td {
  background: #fdfdfd;
}

/* Paginador */
.table-footer {
  background: #f8fafc !important;
  border-top: 1px solid #e2e8f0 !important;
}

.btn-page {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 0.4rem 1rem;
  border-radius: 6px;
  color: #64748b;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-page:hover:not(:disabled) {
  background: #f1f5f9;
  color: #0f172a;
  border-color: #cbd5e1;
}

.btn-page:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 0.85rem;
  color: #64748b;
}
</style>