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
          <h1 class="page-title">Ecografía (Inicio Protocolo)</h1>
          <p class="page-subtitle">Evaluación ginecológica y selección de vientres</p>
        </div>
        <button class="btn-action" @click="generatePDF" :disabled="generatingPdf  || !hasData">
          <i v-if="!generatingPdf" class="fas fa-file-pdf text-danger"></i>
          <div v-else class="spinner-border spinner-border-sm text-danger" role="status"></div>
          <span>{{ generatingPdf ? 'Generando PDF...' : 'Exportar PDF' }}</span>
        </button>
      </div>

      <!-- OVERLAY DE CARGA PARA PDF -->
      <div v-if="generatingPdf" class="pdf-loading-overlay">
        <div class="pdf-loading-card">
          <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
          <h4 class="fw-bold mb-2">Generando reporte PDF</h4>
          <p class="text-muted mb-0">Por favor espere, esto puede tardar unos segundos...</p>
        </div>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-md-3">
          <MetricCard title="Hato Evaluado" :value="data.summary.hato_evaluado.count" subtitle="animales revisados"
            :progress="data.summary.hato_evaluado.pct" variant="neutral"
            :badge="data.summary.hato_objetivo + ' objetivo'" icon="fas fa-search" />
        </div>

        <div class="col-md-3">
          <MetricCard title="Implantadas" :value="data.summary.implanted.count"
            :subtitle="data.summary.implanted.pct + '% del hato evaluado'" :progress="data.summary.implanted.pct"
            variant="success" icon="fas fa-check-circle" />
        </div>

        <div class="col-md-3">
          <MetricCard title="Preñadas (Hallazgo)" :value="data.summary.pregnant.count"
            :subtitle="data.summary.pregnant.pct + '% ya gestantes'" :progress="data.summary.pregnant.pct"
            variant="indigo" icon="fas fa-baby-carriage" />
        </div>

        <div class="col-md-3">
          <MetricCard title="Vitaminas" :value="data.summary.with_vitamins_and_minerals.pct + '%'"
            subtitle="aplicación suplementaria" :progress="data.summary.with_vitamins_and_minerals.pct"
            variant="warning" />
        </div>
      </div>

      <div class="row g-5 mb-5">

        <div class="col-lg-6">
          <h3 class="section-heading mb-4">Rendimiento por Equipo</h3>

          <div class="panel-clean h-100">
            <div class="d-flex align-items-center mb-4 pb-2 border-bottom">
              <span class="section-icon bg-teal-soft text-teal"><i class="fas fa-users"></i></span>
              <h5 class="fw-bold m-0 ms-3 text-dark">Equipos de Trabajo</h5>
            </div>

            <div v-if="data.distributions.work_team && data.distributions.work_team.length > 0"
              class="list-group-clean">
              <div v-for="team in data.distributions.work_team" :key="team.name" class="list-item">
                <div class="d-flex justify-content-between align-items-end mb-2">
                  <span class="item-name">{{ team.name }}</span>
                  <div class="text-end lh-1">
                    <span class="big-count text-dark">{{ team.count }}</span>
                    <span class="big-pct text-teal">{{ team.pct }}%</span>
                  </div>
                </div>
                <div class="progress-track">
                  <div class="progress-fill bg-teal" :style="{ width: team.pct + '%' }"></div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5 text-muted">
              <i class="fas fa-users-slash fs-3 mb-2 opacity-50"></i>
              <p class="mb-0">No hay datos de equipos para este periodo.</p>
            </div>
          </div>
        </div>

        <div class="col-lg-6">
          <h3 class="section-heading mb-4">Protocolo Hormonal</h3>
          <div class="panel-highlight h-100">
            <div class="panel-header mb-4">
              <div class="d-flex align-items-center">
                <span class="section-icon bg-purple-soft text-purple"><i class="fas fa-vial"></i></span>
                <div class="ms-3">
                  <h5 class="fw-bold m-0 text-dark">Productos Utilizados</h5>
                  <span class="text-muted small">Inducción / Sincronización</span>
                </div>
              </div>
            </div>

            <div v-if="data.distributions.products && data.distributions.products.length > 0" class="stats-vertical">
              <div v-for="prod in data.distributions.products" :key="prod.name" class="stat-row">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="stat-label">{{ prod.name }}</span>
                  <div class="text-end lh-1">
                    <span class="big-count text-dark">{{ prod.count }}</span>
                    <span class="big-pct text-purple">{{ prod.pct }}%</span>
                  </div>
                </div>
                <div class="progress-track small-track">
                  <div class="progress-fill bg-purple" :style="{ width: prod.pct + '%' }"></div>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-5 text-muted">
              <i class="fas fa-box-open fs-3 mb-2 opacity-50"></i>
              <p class="mb-0">No se registraron productos.</p>
            </div>
          </div>
        </div>
      </div>

      <div class="table-section">
        <h3 class="section-heading mb-3">Registro Individual</h3>

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
            <span class="status-badge" :class="getStatusClass(row.status)">
              {{ getStatusLabel(row.status) }}
            </span>
          </template>

          <template #protocolo="{ row }">
            <div class="tags-container">
              <span v-if="row.protocol_details" class="mini-tag protocol-tag">{{ row.protocol_details }}</span>
              <span v-if="row.used_products_summary" class="mini-tag products-tag" :title="row.used_products_summary">
                {{ truncateProducts(row.used_products_summary) }}
              </span>
            </div>
          </template>

          <template #vit="{ row }">
            <div class="text-end pe-2">
              <span v-if="row.tenfo_vitamins" class="dot-indicator success" title="Vitaminas Aplicadas"></span>
              <span v-else class="dot-indicator disabled" title="No Aplicadas"></span>
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
const URL_DATA = 'ultrasound';

const { filters: currentFilters, trigger: filterTrigger } = inject('reportFilters');
const filters = ref({ ...currentFilters.value });

// Configuración de Columnas
const tableColumns = [
  { label: 'Identificación', key: 'identificacion', width: '20%' },
  { label: 'Fecha', key: 'fecha', width: '12%' },
  { label: 'Propiedad', key: 'property_name', width: '15%' },
  { label: 'Diagnóstico', key: 'status', width: '15%' },
  { label: 'Protocolo Aplicado', key: 'protocolo', width: '30%' },
  { label: 'Vit.', key: 'vit', width: '8%' }
];

onMounted(async () => { await fetchData(); });

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
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
}

function truncateProducts(products) {
  if (!products) return '';
  const maxLength = 35;
  return products.length > maxLength ? products.substring(0, maxLength) + '...' : products;
}

// Helpers visuales para la tabla
function getStatusClass(status) {
  const map = {
    'implanted': 'badge-blue',
    'pregnant': 'badge-green',
    'discarded': 'badge-red',
    'refugo': 'badge-red'
  };
  return map[status] || 'badge-gray';
}

function getStatusLabel(status) {
  const map = {
    'implanted': 'Protocolo Iniciado',
    'pregnant': 'Preñada (Hallazgo)',
    'discarded': 'Descarte',
    'refugo': 'Refugo'
  };
  return map[status] || status || 'Desconocido';
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

/* Botón PDF */
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

.btn-action:hover:not(:disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
  color: #0f172a;
  transform: translateY(-1px);
}

.btn-action:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.section-heading {
  font-size: 1.1rem;
  font-weight: 700;
  color: #334155;
  letter-spacing: -0.01em;
}

/* --- ESTILOS DE PANELES --- */
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
  border-color: #c084fc;
  background: #faf5ff;
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

.bg-teal-soft {
  background: #ccfbf1;
}

.text-teal {
  color: #0f766e;
}

.bg-teal {
  background: #0f766e;
}

.bg-purple-soft {
  background: #f3e8ff;
}

.text-purple {
  color: #7e22ce;
}

.bg-purple {
  background: #7e22ce;
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
}

.small-track {
  height: 6px;
  background: rgba(126, 34, 206, 0.1);
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

.tags-container {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.mini-tag {
  background: #f8fafc;
  color: #475569;
  font-size: 0.75rem;
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  border: 1px solid #e2e8f0;
  max-width: fit-content;
}

.protocol-tag {
  background: #eff6ff;
  color: #2563eb;
  border-color: #bfdbfe;
}

.products-tag {
  background: #faf5ff;
  color: #7e22ce;
  border-color: #e9d5ff;
  font-size: 0.7rem;
  font-weight: 500;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  display: inline-block;
}

.badge-blue {
  background: #eff6ff;
  color: #2563eb;
  border: 1px solid #dbeafe;
}

.badge-green {
  background: #ecfdf5;
  color: #059669;
  border: 1px solid #d1fae5;
}

.badge-red {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fee2e2;
}

.badge-gray {
  background: #f8fafc;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.dot-indicator {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.dot-indicator.success {
  background: #10b981;
  box-shadow: 0 0 0 4px #d1fae5;
}

.dot-indicator.disabled {
  background: #e2e8f0;
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