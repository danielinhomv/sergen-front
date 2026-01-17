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
          <h1 class="page-title">Registro de Partos</h1>
          <p class="page-subtitle">Control de nacimientos y características de los terneros</p>
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
          <MetricCard title="Cobertura" :value="data.summary.cobertura_pct + '%'" subtitle="partos registrados"
            :progress="data.summary.cobertura_pct" variant="success"
            :badge="data.summary.total_mothers_with_birth + ' madres'" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Hato Objetivo" :value="data.summary.hato_objetivo" subtitle="partos esperados"
            variant="neutral" icon="fas fa-bullseye" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Partos Normales" :value="data.summary.normal.count"
            :subtitle="data.summary.normal.pct + '% exitosos'" :progress="data.summary.normal.pct" variant="info" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Complicaciones"
            :value="data.summary.abort.count + data.summary.stillbirth.count + data.summary.premeture.count"
            :subtitle="'abortos y pérdidas'" variant="warning" icon="fas fa-exclamation-triangle" />
        </div>
      </div>

      <div class="row g-5 mb-5">

        <div class="col-lg-8">
          <h3 class="section-heading mb-4">Resultados y Distribución</h3>

          <div class="panel-clean">
            <div class="row g-5">
              <div class="col-md-6">
                <div class="d-flex align-items-center mb-4 pb-2 border-bottom">
                  <span class="section-icon bg-blue-soft text-blue"><i class="fas fa-heartbeat"></i></span>
                  <h5 class="fw-bold m-0 ms-3 text-dark">Tipo de Parto</h5>
                </div>

                <div class="list-group-clean">
                  <div v-for="item in data.distributions.type_of_birth" :key="item.name" class="list-item">
                    <div class="d-flex justify-content-between align-items-end mb-2">
                      <span class="item-name">{{ translateBirthType(item.name) }}</span>
                      <div class="text-end lh-1">
                        <span class="big-count text-dark">{{ item.count }}</span>
                        <span class="big-pct" :class="getBirthTypeColorClass(item.name)">{{ item.pct }}%</span>
                      </div>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill" :class="getBirthTypeBgClass(item.name)"
                        :style="{ width: item.pct + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="col-md-6">
                <div class="d-flex align-items-center mb-4 pb-2 border-bottom">
                  <span class="section-icon bg-purple-soft text-purple"><i class="fas fa-venus-mars"></i></span>
                  <h5 class="fw-bold m-0 ms-3 text-dark">Sexo de Terneros</h5>
                </div>

                <div class="list-group-clean">
                  <div class="list-item">
                    <div class="d-flex justify-content-between align-items-end mb-2">
                      <span class="item-name">Machos</span>
                      <div class="text-end lh-1">
                        <span class="big-count text-dark">{{ data.summary.male_calves.count }}</span>
                        <span class="big-pct text-purple">{{ data.summary.male_calves.pct }}%</span>
                      </div>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill bg-purple" :style="{ width: data.summary.male_calves.pct + '%' }"></div>
                    </div>
                  </div>

                  <div class="list-item">
                    <div class="d-flex justify-content-between align-items-end mb-2">
                      <span class="item-name">Hembras</span>
                      <div class="text-end lh-1">
                        <span class="big-count text-dark">{{ data.summary.female_calves.count }}</span>
                        <span class="big-pct text-purple">{{ data.summary.female_calves.pct }}%</span>
                      </div>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill bg-purple" :style="{ width: data.summary.female_calves.pct + '%' }">
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <h3 class="section-heading mb-4">Estado General</h3>
          <div class="panel-highlight h-100">
            <div class="panel-header mb-4">
              <div class="d-flex align-items-center">
                <span class="section-icon bg-orange-soft text-orange"><i class="fas fa-chart-pie"></i></span>
                <div class="ms-3">
                  <h5 class="fw-bold m-0 text-dark">Resumen</h5>
                  <span class="text-muted small">{{ data.summary.total_records }} partos totales</span>
                </div>
              </div>
            </div>

            <div class="stats-vertical">
              <div class="stat-row">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="stat-label">Normales</span>
                  <div class="text-end lh-1">
                    <span class="big-count text-dark">{{ data.summary.normal.count }}</span>
                    <span class="big-pct text-success">{{ data.summary.normal.pct }}%</span>
                  </div>
                </div>
                <div class="progress-track small-track">
                  <div class="progress-fill bg-success" :style="{ width: data.summary.normal.pct + '%' }"></div>
                </div>
              </div>

              <div class="stat-row">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="stat-label">Abortos</span>
                  <div class="text-end lh-1">
                    <span class="big-count text-dark">{{ data.summary.abort.count }}</span>
                    <span class="big-pct text-danger">{{ data.summary.abort.pct }}%</span>
                  </div>
                </div>
                <div class="progress-track small-track">
                  <div class="progress-fill bg-danger" :style="{ width: data.summary.abort.pct + '%' }"></div>
                </div>
              </div>

              <div v-if="data.summary.stillbirth.count > 0" class="stat-row">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="stat-label">Mortinatos</span>
                  <div class="text-end lh-1">
                    <span class="big-count text-dark">{{ data.summary.stillbirth.count }}</span>
                    <span class="big-pct text-danger">{{ data.summary.stillbirth.pct }}%</span>
                  </div>
                </div>
                <div class="progress-track small-track">
                  <div class="progress-fill bg-danger" :style="{ width: data.summary.stillbirth.pct + '%' }"></div>
                </div>
              </div>

              <div v-if="data.summary.premeture.count > 0" class="stat-row">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="stat-label">Prematuros</span>
                  <div class="text-end lh-1">
                    <span class="big-count text-dark">{{ data.summary.premeture.count }}</span>
                    <span class="big-pct text-warning">{{ data.summary.premeture.pct }}%</span>
                  </div>
                </div>
                <div class="progress-track small-track">
                  <div class="progress-fill bg-warning" :style="{ width: data.summary.premeture.pct + '%' }"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="table-section">
        <h3 class="section-heading mb-3">Registro Individual de Partos</h3>

        <DataTable :columns="tableColumns" :data="data.details" :itemsPerPage="10">
          <template #madre="{ row }">
            <div class="id-group">
              <div class="id-avatar">{{ row.mother_bovine_id }}</div>
              <div class="id-text">
                <span class="primary-id">{{ row.mother_serie || 'S/N' }}</span>
                <span class="secondary-id">{{ row.mother_rgd || '—' }}</span>
              </div>
            </div>
          </template>

          <template #cria="{ row }">
            <div class="id-group">
              <div class="id-avatar">{{ row.calf_id }}</div>
              <div class="id-text">
                <span class="primary-id">{{ row.calf_serie || 'S/N' }}</span>
                <span class="secondary-id">{{ row.calf_rgd || '—' }}</span>
              </div>
            </div>
          </template>

          <template #fecha="{ row }">
            <span class="text-secondary fw-medium">{{ formatDate(row.birth_date) }}</span>
          </template>

          <template #sexo="{ row }">
            <span class="sex-label" :class="getSexClass(row.calf_sex)">
              {{ translateSex(row.calf_sex) }}
            </span>
          </template>

          <template #tipo="{ row }">
            <span class="birth-badge" :class="getBirthTypeBadgeClass(row.type_of_birth)">
              {{ translateBirthType(row.type_of_birth) }}
            </span>
          </template>

          <template #peso="{ row }">
            <div class="text-center">
              <span class="weight-value" :class="getWeightClass(row.calf_weight, row.type_of_birth)">
                {{ row.calf_weight }} kg
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
const URL_DATA = 'birth';

const { filters: currentFilters, trigger: filterTrigger } = inject('reportFilters');
const filters = ref({ ...currentFilters.value });

// Configuración de Columnas para DataTable
const tableColumns = [
  { label: 'Madre', key: 'madre', width: '18%' },
  { label: 'Cría', key: 'cria', width: '18%' },
  { label: 'Fecha Parto', key: 'fecha', width: '13%' },
  { label: 'Propiedad', key: 'property_name' },
  { label: 'Sexo', key: 'sexo', width: '10%' },
  { label: 'Tipo', key: 'tipo', width: '12%' },
  { label: 'Peso', key: 'peso', width: '10%' }
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

function translateBirthType(type) {
  const translations = {
    'normal': 'Normal',
    'abort': 'Aborto',
    'stillbirth': 'Mortinato',
    'premeture': 'Prematuro'
  };
  return translations[type] || type;
}

function translateSex(sex) {
  const translations = {
    'male': 'Macho',
    'female': 'Hembra'
  };
  return translations[sex] || sex;
}

function getSexClass(sex) {
  return sex === 'male' ? 'sex-male' : 'sex-female';
}

function getBirthTypeColorClass(type) {
  const classes = {
    'normal': 'text-success',
    'abort': 'text-danger',
    'stillbirth': 'text-danger',
    'premeture': 'text-warning'
  };
  return classes[type] || 'text-muted';
}

function getBirthTypeBgClass(type) {
  const classes = {
    'normal': 'bg-success',
    'abort': 'bg-danger',
    'stillbirth': 'bg-danger',
    'premeture': 'bg-warning'
  };
  return classes[type] || 'bg-secondary';
}

function getBirthTypeBadgeClass(type) {
  const classes = {
    'normal': 'badge-success',
    'abort': 'badge-danger',
    'stillbirth': 'badge-danger',
    'premeture': 'badge-warning'
  };
  return classes[type] || 'badge-secondary';
}

function getWeightClass(weight, type) {
  if (type !== 'normal') return 'weight-abort';
  if (weight >= 35) return 'weight-good';
  if (weight >= 25) return 'weight-normal';
  return 'weight-low';
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
  border-color: #fdba74;
  background: #fffaf0;
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

.bg-orange-soft {
  background: #fff7ed;
}

.text-orange {
  color: #ea580c;
}

.bg-orange {
  background: #ea580c;
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
  background: rgba(249, 115, 22, 0.1);
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

/* Sex Label con borde de color */
.sex-label {
  font-weight: 700;
  font-size: 0.85rem;
  padding: 5px 12px;
  border-radius: 6px;
  border: 2px solid;
  display: inline-block;
  background: white;
}

.sex-male {
  border-color: #3b82f6;
  color: #1e40af;
}

.sex-female {
  border-color: #ec4899;
  color: #be185d;
}

/* Birth Type Badge */
.birth-badge {
  padding: 5px 12px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
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

/* Weight Value */
.weight-value {
  font-weight: 700;
  font-size: 0.95rem;
  padding: 4px 10px;
  border-radius: 6px;
  display: inline-block;
}

.weight-good {
  background: #d1fae5;
  color: #065f46;
}

.weight-normal {
  background: #dbeafe;
  color: #1e40af;
}

.weight-low {
  background: #fef3c7;
  color: #92400e;
}

.weight-abort {
  background: #fee2e2;
  color: #991b1b;
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
