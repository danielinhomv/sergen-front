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
          <h1 class="page-title">Palpación General</h1>
          <p class="page-subtitle">Diagnóstico de preñez y control gestacional avanzado</p>
        </div>
        <button class="btn-action" @click="generatePDF" :disabled="isGeneratingPdf || !hasData">
          <i v-if="!isGeneratingPdf" class="fas fa-file-pdf text-danger"></i>
          <div v-else class="spinner-border spinner-border-sm text-danger" role="status"></div>
          <span>{{ isGeneratingPdf ? 'Generando PDF...' : 'Exportar PDF' }}</span>
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

      <div class="row g-4 mb-5">
        <div class="col-md-3">
          <MetricCard title="Tasa de Preñez" :value="data.summary.pregnancy_pct + '%'"
            subtitle="gestaciones confirmadas" :progress="data.summary.pregnancy_pct" variant="success"
            :badge="data.summary.pregnant.count + ' preñadas'" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Cobertura" :value="data.summary.cobertura_pct + '%'" subtitle="diagnósticos realizados"
            :progress="data.summary.cobertura_pct" variant="info" :badge="data.summary.total_diagnosticos + ' total'" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Vacías" :value="data.summary.empty.count"
            :subtitle="data.summary.empty.pct + '% no gestantes'" variant="warning" icon="fas fa-times-circle" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Abortos" :value="data.summary.abort.count"
            :subtitle="data.summary.abort.pct + '% pérdidas'" variant="danger" icon="fas fa-exclamation-triangle" />
        </div>
      </div>

      <!-- Status Table -->
      <div class="status-summary-box mb-5">
        <div class="row g-0">
          <div v-for="item in data.status_table" :key="item.status" class="col-md-3">
            <div class="status-stat" :class="getStatusBoxClass(item.status)">
              <div class="status-icon">
                <i :class="getStatusIcon(item.status)"></i>
              </div>
              <div class="status-data">
                <span class="status-count">{{ item.count }}</span>
                <span class="status-label">{{ translateStatus(item.status) }}</span>
                <span class="status-pct">{{ item.pct }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="row g-5 mb-5">

        <div class="col-lg-7">
          <h3 class="section-heading mb-4">Efectividad por Toro</h3>

          <div class="panel-clean">
            <div class="d-flex align-items-center mb-4 pb-2 border-bottom">
              <span class="section-icon bg-blue-soft text-blue"><i class="fas fa-dna"></i></span>
              <h5 class="fw-bold m-0 ms-3 text-dark">Desempeño Reproductivo</h5>
            </div>

            <div class="list-group-clean">
              <div v-for="item in data.distributions.pregnancy_by_bull" :key="item.name" class="list-item">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="item-name">{{ item.name }}</span>
                  <div class="text-end">
                    <span class="bull-stats">{{ item.pregnant }}/{{ item.total }}</span>
                    <span class="bull-pct" :class="getPregnancyColorClass(item.pregnancy_rate_pct)">
                      {{ item.pregnancy_rate_pct }}%
                    </span>
                  </div>
                </div>
                <div class="progress-track">
                  <div class="progress-fill" :class="getPregnancyBgClass(item.pregnancy_rate_pct)"
                    :style="{ width: item.pregnancy_rate_pct + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-5">
          <h3 class="section-heading mb-4">Resultados por Calidad de Celo</h3>
          <div class="panel-highlight h-100">
            <div class="panel-header mb-4">
              <div class="d-flex align-items-center">
                <span class="section-icon bg-purple-soft text-purple"><i class="fas fa-chart-bar"></i></span>
                <div class="ms-3">
                  <h5 class="fw-bold m-0 text-dark">Análisis</h5>
                  <span class="text-muted small">Preñez vs Celo inicial</span>
                </div>
              </div>
            </div>

            <div class="stats-vertical">
              <div v-for="item in data.distributions.pregnancy_by_heat_quality" :key="item.name" class="stat-row">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <div class="d-flex align-items-center gap-2">
                    <span class="heat-indicator" :class="getHeatQualityClass(item.name)"></span>
                    <span class="stat-label">{{ capitalizeFirst(item.name) }}</span>
                  </div>
                  <div class="text-end lh-1">
                    <span class="big-count text-dark">{{ item.pregnant }}/{{ item.total }}</span>
                    <span class="big-pct text-purple">{{ item.pregnancy_rate_pct }}%</span>
                  </div>
                </div>
                <div class="progress-track small-track">
                  <div class="progress-fill bg-purple" :style="{ width: item.pregnancy_rate_pct + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-section">
        <h3 class="section-heading mb-3">Registro Individual de Diagnósticos</h3>

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

          <template #toro="{ row }">
            <div class="d-flex align-items-center gap-2">
              <span class="bull-icon"><i class="fas fa-dna"></i></span>
              <span class="fw-medium text-dark">{{ row.bull_name }}</span>
            </div>
          </template>

          <template #resultado="{ row }">
            <span class="status-badge" :class="getStatusBadgeClass(row.status)">
              <i :class="getStatusIcon(row.status)"></i>
              {{ translateStatus(row.status) }}
            </span>
          </template>

          <template #dias="{ row }">
            <div class="text-center">
              <span class="dias-gestacion">{{ extractDays(row.observation) }}</span>
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
const URL_DATA = 'general-palpation';

const { filters: currentFilters, trigger: filterTrigger } = inject('reportFilters');
const filters = ref({ ...currentFilters.value });

// Configuración de Columnas para DataTable
const tableColumns = [
  { label: 'Identificación', key: 'identificacion', width: '20%' },
  { label: 'Fecha Palpación', key: 'fecha', width: '14%' },
  { label: 'Propiedad', key: 'property_name' },
  { label: 'Toro', key: 'toro', width: '18%' },
  { label: 'Resultado', key: 'resultado', width: '14%' },
  { label: 'Días', key: 'dias', width: '8%' }
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

function capitalizeFirst(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function translateStatus(status) {
  const translations = {
    'pregnant': 'Preñada',
    'empty': 'Vacía',
    'discard': 'Descarte',
    'abort': 'Aborto'
  };
  return translations[status] || status;
}

function getStatusIcon(status) {
  const icons = {
    'pregnant': 'fas fa-check-circle',
    'empty': 'fas fa-times-circle',
    'discard': 'fas fa-ban',
    'abort': 'fas fa-exclamation-triangle'
  };
  return icons[status] || 'fas fa-circle';
}

function getStatusBoxClass(status) {
  const classes = {
    'pregnant': 'box-pregnant',
    'empty': 'box-empty',
    'discard': 'box-discard',
    'abort': 'box-abort'
  };
  return classes[status] || '';
}

function getStatusBadgeClass(status) {
  const classes = {
    'pregnant': 'badge-success',
    'empty': 'badge-warning',
    'discard': 'badge-danger',
    'abort': 'badge-secondary'
  };
  return classes[status] || 'badge-secondary';
}

function getHeatQualityClass(quality) {
  const classes = {
    'bueno': 'heat-good',
    'regular': 'heat-regular',
    'malo': 'heat-bad'
  };
  return classes[quality] || '';
}

function getPregnancyColorClass(pct) {
  if (pct >= 70) return 'text-success';
  if (pct >= 40) return 'text-warning';
  return 'text-danger';
}

function getPregnancyBgClass(pct) {
  if (pct >= 70) return 'bg-success';
  if (pct >= 40) return 'bg-warning';
  return 'bg-danger';
}

function extractDays(observation) {
  if (!observation) return '—';
  const match = observation.match(/(\d+)\s*días/);
  return match ? match[1] + 'd' : '—';
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

.section-heading {
  font-size: 1.1rem;
  font-weight: 700;
  color: #334155;
  letter-spacing: -0.01em;
}

/* Status Summary Box */
.status-summary-box {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.status-stat {
  padding: 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  border-right: 1px solid #e2e8f0;
  transition: all 0.2s;
}

.status-stat:last-child {
  border-right: none;
}

.status-stat:hover {
  background: #f8fafc;
}

.status-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.box-pregnant .status-icon {
  background: #d1fae5;
  color: #059669;
}

.box-empty .status-icon {
  background: #fef3c7;
  color: #d97706;
}

.box-discard .status-icon {
  background: #fee2e2;
  color: #dc2626;
}

.box-abort .status-icon {
  background: #f1f5f9;
  color: #64748b;
}

.status-data {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.status-count {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
}

.status-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.25rem;
}

.status-pct {
  font-size: 1.1rem;
  font-weight: 700;
  color: #475569;
  margin-top: 0.25rem;
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
  border-color: #c4b5fd;
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

.text-success {
  color: #10b981;
}

.bg-success {
  background: #10b981;
}

.text-warning {
  color: #f59e0b;
}

.bg-warning {
  background: #f59e0b;
}

.text-danger {
  color: #ef4444;
}

.bg-danger {
  background: #ef4444;
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

/* Bull Stats */
.bull-stats {
  font-size: 1.2rem;
  font-weight: 700;
  color: #475569;
  margin-right: 12px;
}

.bull-pct {
  font-size: 1.4rem;
  font-weight: 800;
  margin-left: 8px;
}

/* Números Grandes */
.big-count {
  font-size: 1.5rem;
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
  background: rgba(124, 58, 237, 0.1);
}

/* Heat Quality Indicators */
.heat-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.heat-good {
  background: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.heat-regular {
  background: #f59e0b;
  box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.2);
}

.heat-bad {
  background: #ef4444;
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
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

/* Bull Icon */
.bull-icon {
  width: 28px;
  height: 28px;
  background: #eff6ff;
  color: #2563eb;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;
}

/* Status Badge */
.status-badge {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.badge-success {
  background: #d1fae5;
  color: #065f46;
}

.badge-warning {
  background: #fef3c7;
  color: #92400e;
}

.badge-danger {
  background: #fee2e2;
  color: #991b1b;
}

.badge-secondary {
  background: #f1f5f9;
  color: #64748b;
}

/* Días de Gestación */
.dias-gestacion {
  font-weight: 700;
  font-size: 1.05rem;
  color: #0f172a;
  background: #f1f5f9;
  padding: 4px 12px;
  border-radius: 6px;
  display: inline-block;
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
