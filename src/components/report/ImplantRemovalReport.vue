<template>
  <div class="report-container">

    <!-- Loading inicial -->
    <div v-if="loading" class="d-flex justify-content-center align-items-center py-5" style="height: 400px;">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-else-if="error" class="alert alert-danger d-flex align-items-center p-3 mb-4 rounded-3 shadow-sm">
      <i class="fas fa-exclamation-circle me-3 fs-4"></i>
      <span class="fw-medium">{{ error }}</span>
    </div>

    <div v-else-if="data" class="content-wrapper animate-fade">

      <div class="d-flex justify-content-between align-items-center mb-5">
        <div>
          <h1 class="page-title">Retiro de Implante</h1>
          <p class="page-subtitle">Resultados de recuperación y pérdidas del protocolo</p>
        </div>
        <button class="btn-action" @click="generatePDF" :disabled="generatingPdf || !hasData">
          <i v-if="!generatingPdf" class="fas fa-file-pdf text-danger"></i>
          <div v-else class="spinner-border spinner-border-sm text-danger" role="status"></div>
          <span>{{ generatingPdf ? 'Generando PDF...' : 'Exportar PDF' }}</span>
        </button>
      </div>

      <!-- OVERLAY DE CARGA PARA PDF -->
      <div v-if="generatingPdf" class="pdf-loading-overlay">
        <div class="loading-modal">
          <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
          <h4 class="fw-bold mb-2">Generando reporte PDF</h4>
          <p class="text-muted mb-0">Por favor espere...</p>
        </div>
      </div>

      <!-- Métricas principales -->
      <div class="row g-4 mb-5">
        <div class="col-md-3">
          <MetricCard title="Implantes Recuperados" :value="data.summary.total_animals_retrieved.count"
            :subtitle="data.summary.total_animals_retrieved.pct + '% de éxito'"
            :progress="data.summary.total_animals_retrieved.pct" variant="success" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Pérdidas" :value="data.summary.implant_losses.count"
            :subtitle="data.summary.implant_losses.pct + '% perdidos'" :progress="data.summary.implant_losses.pct"
            variant="danger" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Cobertura" :value="data.summary.cobertura_pct + '%'" subtitle="animales procesados"
            :progress="data.summary.cobertura_pct" variant="info"
            :badge="data.summary.total_animals_processed + ' total'" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Hato Objetivo" :value="data.summary.hato_objetivo" subtitle="cabezas programadas"
            variant="neutral" icon="fas fa-bullseye" />
        </div>
      </div>

      <!-- Distribuciones -->
      <div class="row g-5 mb-5">

        <div class="col-lg-8">
          <h3 class="section-heading mb-4">Distribución por Equipo</h3>

          <div class="panel-clean">
            <div class="list-group-clean">
              <div v-for="item in data.distributions.work_team" :key="item.name" class="list-item">
                <div class="d-flex justify-content-between align-items-end mb-2">
                  <span class="item-name">{{ item.name }}</span>
                  <div class="text-end lh-1">
                    <span class="big-count text-dark">{{ item.count }}</span>
                    <span class="big-pct text-blue">{{ item.pct }}%</span>
                  </div>
                </div>
                <div class="progress-track">
                  <div class="progress-fill bg-blue" :style="{ width: item.pct + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <h3 class="section-heading mb-4">Estado de Implantes</h3>
          <div class="panel-highlight h-100">
            <div class="stats-vertical">
              <div v-for="item in data.status_table" :key="item.status" class="stat-row">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="stat-label">{{ translateStatus(item.status) }}</span>
                  <div class="text-end lh-1">
                    <span class="big-count text-dark">{{ item.count }}</span>
                    <span class="big-pct" :class="getStatusColorClass(item.status)">{{ item.pct }}%</span>
                  </div>
                </div>
                <div class="progress-track small-track">
                  <div class="progress-fill" :class="getStatusBgClass(item.status)" :style="{ width: item.pct + '%' }">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Productos utilizados -->
      <div class="row g-4 mb-5">
        <div class="col-12">
          <h3 class="section-heading mb-4">Productos Utilizados</h3>
          <div class="panel-clean">
            <div class="row g-4">
              <div v-for="product in data.distributions.products" :key="product.name" class="col-md-6">
                <div class="product-card">
                  <div class="d-flex align-items-center mb-3">
                    <span class="section-icon bg-purple-soft text-purple"><i class="fas fa-syringe"></i></span>
                    <div class="ms-3">
                      <h6 class="fw-bold m-0 text-dark">{{ product.name }}</h6>
                      <span class="text-muted small">{{ product.count }} aplicaciones</span>
                    </div>
                  </div>
                  <div class="progress-track">
                    <div class="progress-fill bg-purple" :style="{ width: product.pct + '%' }"></div>
                  </div>
                  <div class="text-end mt-2">
                    <span class="badge bg-purple-soft text-purple">{{ product.pct }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tabla de detalles -->
      <div class="table-section">
        <h3 class="section-heading mb-3">Registro Individual de Retiros</h3>

        <DataTable :columns="tableColumns" :data="data.details" :itemsPerPage="10">
          <template #identificacion="{ row }">
            <div class="id-group">
              <div class="id-avatar">{{ row.bovine_id }}</div>
              <div class="id-text">
                <span class="primary-id">{{ row.serie || 'S/N' }}</span>
                <span class="secondary-id">{{ row.rgd || '—' }}</span>
              </div>
            </div>
          </template>

          <template #fecha="{ row }">
            <span class="text-secondary fw-medium">{{ formatDate(row.date) }}</span>
          </template>

          <template #status="{ row }">
            <span class="status-badge" :class="getStatusBadgeClass(row.status)">
              {{ translateStatus(row.status) }}
            </span>
          </template>

          <template #productos="{ row }">
            <div class="tags-container">
              <span v-for="(product, index) in row.used_products_summary.split(', ')" :key="index" class="mini-tag">
                {{ product }}
              </span>
            </div>
          </template>
        </DataTable>
      </div>

    </div>

    <!-- Modal de Carga para PDF -->
    <div v-if="generatingPdf" class="pdf-loading-overlay">
      <div class="pdf-loading-card">
        <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
        <h4 class="fw-bold mb-2">Generando reporte PDF</h4>
        <p class="text-muted mb-0">Por favor espere, esto puede tardar unos segundos...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject, computed } from 'vue';
import ReportService from '@/services/report/ReportService';
import MetricCard from '@/components/common/MetricCard.vue';
import DataTable from '@/components/common/DataTable.vue';

const data = ref(null);
const loading = ref(true);
const error = ref(null);
const generatingPdf = ref(false);
const URL_DATA = 'implant-retrieval';

const { filters: currentFilters, trigger: filterTrigger } = inject('reportFilters');
const filters = ref({ ...currentFilters.value });

// Configuración de Columnas para DataTable
const tableColumns = [
  { label: 'Identificación', key: 'identificacion', width: '20%' },
  { label: 'Fecha', key: 'fecha', width: '12%' },
  { label: 'Propiedad', key: 'property_name', width: '15%' },
  { label: 'Estado', key: 'status', width: '12%' },
  { label: 'Equipo', key: 'work_team', width: '15%' },
  { label: 'Productos Usados', key: 'productos', width: '26%' }
];

onMounted(async () => {
  await fetchData();
});

watch(() => filterTrigger.value, async () => {
  filters.value = { ...currentFilters.value };
  await fetchData();
});

async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    data.value = await ReportService.getReport(filters.value, URL_DATA);
  } catch (err) {
    error.value = "Error al conectar con el servidor.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

// Computed para verificar si hay datos en detalles
const hasData = computed(() => {
  return data.value && data.value.details && data.value.details.length > 0;
});

async function generatePDF() {
    // Validar que existan datos
  if (!data.value || Object.keys(data.value).length === 0) {
    error.value = "No hay datos disponibles para generar el reporte.";
    return;
  }

  // Validar que al menos haya un registro en detalles
  if (!data.value.details || data.value.details.length === 0) {
    error.value = "No hay registros para exportar. Verifique los filtros aplicados.";
    return;
  }

  generatingPdf.value = true;
  try {

    await ReportService.exportReportPdf(filters.value, URL_DATA);
  } catch (err) {
    console.error('Error al generar PDF:', err);
    error.value = err.message || "Error al generar el PDF.";
  } finally {
    generatingPdf.value = false;
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

function translateStatus(status) {
  const translations = {
    'retrieved': 'Recuperado',
    'lost': 'Perdido'
  };
  return translations[status] || status;
}

function getStatusColorClass(status) {
  return status === 'retrieved' ? 'text-success' : 'text-danger';
}

function getStatusBgClass(status) {
  return status === 'retrieved' ? 'bg-success' : 'bg-danger';
}

function getStatusBadgeClass(status) {
  return status === 'retrieved' ? 'badge-success' : 'badge-danger';
}
</script>

<style scoped>
.report-container {
  font-family: 'Inter', system-ui, sans-serif;
  color: #1e293b;
  max-width: 1400px;
  margin: 0 auto;
}

/* Header */
.page-title {
  font-weight: 800;
  font-size: 1.8rem;
  letter-spacing: -0.02em;
  color: #0f172a;
  margin-bottom: 0.25rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* Botón PDF Outline */
.btn-action {
  background: white;
  border: 1px solid #cbd5e1;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  color: #334155;
  font-weight: 600;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s;
  cursor: pointer;
}

.btn-action:hover {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #0f172a;
  transform: translateY(-1px);
}

.btn-action:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.section-heading {
  font-size: 1.1rem;
  font-weight: 700;
  color: #334155;
  letter-spacing: -0.01em;
}

/* --- ESTILOS DE PANELS --- */
.panel-clean,
.panel-highlight {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem;
}

.panel-clean {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.panel-highlight {
  border-color: #cbd5e1;
  background: #f8fafc;
}

/* Iconos de Sección */
.section-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
}

.bg-blue-soft {
  background: #eff6ff;
}

.text-blue {
  color: #2563eb;
}

.bg-blue {
  background: #2563eb;
}

.bg-purple-soft {
  background: #f5f3ff;
}

.text-purple {
  color: #7c3aed;
}

.bg-purple {
  background: #7c3aed;
}

.bg-success {
  background: #10b981;
}

.text-success {
  color: #10b981;
}

.bg-danger {
  background: #ef4444;
}

.text-danger {
  color: #ef4444;
}

/* Listas */
.list-group-clean,
.stats-vertical {
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
}

.item-name,
.stat-label {
  font-weight: 600;
  color: #475569;
  font-size: 1rem;
}

/* Números Grandes */
.big-count {
  font-size: 1.8rem;
  font-weight: 800;
  margin-right: 8px;
}

.big-pct {
  font-size: 1.2rem;
  font-weight: 600;
}

/* Barras de Progreso */
.progress-track {
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.small-track {
  height: 6px;
}

/* Product Card */
.product-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  transition: all 0.2s;
}

.product-card:hover {
  border-color: #cbd5e1;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* --- ESTILOS PARA SLOTS DE TABLA --- */
.id-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.id-avatar {
  width: 36px;
  height: 36px;
  background: #f1f5f9;
  color: #475569;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

.id-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.primary-id {
  font-weight: 700;
  color: #0f172a;
  font-size: 0.95rem;
}

.secondary-id {
  font-size: 0.8rem;
  color: #94a3b8;
}

/* Status Badge */
.status-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.mini-tag {
  background: #f8fafc;
  color: #475569;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
}

/* Modal de Carga PDF */
.pdf-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease-out;
}

.pdf-loading-card {
  background: white;
  border-radius: 16px;
  padding: 3rem 4rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

.pdf-loading-card h4 {
  color: #0f172a;
}

.pdf-loading-card p {
  font-size: 0.95rem;
}

.loading-modal {
  background: white;
  border-radius: 16px;
  padding: 3rem 4rem;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  animation: slideUp 0.3s ease-out;
}

.loading-modal h4 {
  color: #0f172a;
}

.loading-modal p {
  font-size: 0.95rem;
}

.animate-fade {
  animation: fadeIn 0.5s ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
