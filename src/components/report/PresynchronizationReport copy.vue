<template>
  <div class="report-container">

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
          <h1 class="page-title">Presincronización</h1>
          <p class="page-subtitle">Resultados técnicos y cumplimiento del protocolo</p>
        </div>
        <button class="btn-action" @click="generatePDF">
          <i class="fas fa-file-pdf text-danger"></i>
          <span>Exportar PDF</span>
        </button>
      </div>

      <div class="row g-4 mb-5">
        <div class="col-md-3">
          <MetricCard title="Cobertura" :value="data.summary.cobertura_pct + '%'" subtitle="animales tratados"
            :progress="data.summary.cobertura_pct" variant="success" :badge="data.summary.total_animals + ' total'" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Hato Objetivo" :value="data.summary.hato_objetivo" subtitle="cabezas programadas"
            variant="neutral" icon="fas fa-bullseye" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Pendientes" :value="data.summary.faltantes"
            :subtitle="data.summary.faltantes_pct + '% ausentismo'" variant="warning" icon="fas fa-clock" />
        </div>
        <div class="col-md-3">
          <MetricCard title="Vitaminas" :value="data.summary.with_vitamins_and_minerals.pct + '%'"
            subtitle="aplicación suplementaria" :progress="data.summary.with_vitamins_and_minerals.pct"
            variant="indigo" />
        </div>
      </div>

      <div class="row g-5 mb-5">

        <div class="col-lg-8">
          <h3 class="section-heading mb-4">Insumos Aplicados</h3>

          <div class="panel-clean">
            <div class="row g-5">
              <div class="col-md-6">
                <div class="d-flex align-items-center mb-4 pb-2 border-bottom">
                  <span class="section-icon bg-blue-soft text-blue"><i class="fas fa-syringe"></i></span>
                  <h5 class="fw-bold m-0 ms-3 text-dark">Vacunas</h5>
                </div>

                <div class="list-group-clean">
                  <div v-for="item in data.distributions.reproductive_vaccine" :key="item.name" class="list-item">
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

              <div class="col-md-6">
                <div class="d-flex align-items-center mb-4 pb-2 border-bottom">
                  <span class="section-icon bg-purple-soft text-purple"><i class="fas fa-ring"></i></span>
                  <h5 class="fw-bold m-0 ms-3 text-dark">Dispositivos</h5>
                </div>

                <div class="list-group-clean">
                  <div v-for="item in data.distributions.sincrogest_product" :key="item.name" class="list-item">
                    <div class="d-flex justify-content-between align-items-end mb-2">
                      <span class="item-name">{{ item.name }}</span>
                      <div class="text-end lh-1">
                        <span class="big-count text-dark">{{ item.count }}</span>
                        <span class="big-pct text-purple">{{ item.pct }}%</span>
                      </div>
                    </div>
                    <div class="progress-track">
                      <div class="progress-fill bg-purple" :style="{ width: item.pct + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <h3 class="section-heading mb-4">Sanidad</h3>
          <div class="panel-highlight h-100">
            <div class="panel-header mb-4">
              <div class="d-flex align-items-center">
                <span class="section-icon bg-orange-soft text-orange"><i class="fas fa-shield-alt"></i></span>
                <div class="ms-3">
                  <h5 class="fw-bold m-0 text-dark">Antiparasitarios</h5>
                  <span class="text-muted small">Control sanitario</span>
                </div>
              </div>
            </div>

            <div class="stats-vertical">
              <div v-for="item in data.distributions.antiparasitic_product" :key="item.name" class="stat-row">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <span class="stat-label">{{ item.name }}</span>
                  <div class="text-end lh-1">
                    <span class="big-count text-dark">{{ item.count }}</span>
                    <span class="big-pct text-orange">{{ item.pct }}%</span>
                  </div>
                </div>
                <div class="progress-track small-track">
                  <div class="progress-fill bg-orange" :style="{ width: item.pct + '%' }"></div>
                </div>
              </div>
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
            <span class="text-secondary fw-medium">{{ formatDate(row.application_date) }}</span>
          </template>

          <template #protocolo="{ row }">
            <div class="tags-container">
              <span v-if="row.reproductive_vaccine" class="mini-tag">{{ row.reproductive_vaccine }}</span>
              <span v-if="row.sincrogest_product" class="mini-tag">{{ row.sincrogest_product }}</span>
              <span v-if="row.antiparasitic_product" class="mini-tag">{{ row.antiparasitic_product }}</span>
            </div>
          </template>

          <template #vit="{ row }">
            <div class="text-end pe-2">
              <span v-if="row.vitamins_and_minerals" class="dot-indicator success" title="Aplicado"></span>
              <span v-else class="dot-indicator disabled" title="No aplicado"></span>
            </div>
          </template>

        </DataTable>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, inject } from 'vue';
import ReportService from '@/services/report/ReportService';
import MetricCard from '@/components/common/MetricCard.vue';
import DataTable from '@/components/common/DataTable.vue';

const data = ref(null);
const loading = ref(true);
const error = ref(null);
const URL_DATA = 'presynchronization';

const { filters: currentFilters, trigger: filterTrigger } = inject('reportFilters');
const filters = ref({ ...currentFilters.value });

// Configuración de Columnas para DataTable
const tableColumns = [
  { label: 'Identificación', key: 'identificacion', width: '25%' },
  { label: 'Fecha', key: 'fecha', width: '15%' },
  { label: 'Propiedad', key: 'property_name' },
  { label: 'Protocolo Aplicado', key: 'protocolo', width: '35%' },
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

function generatePDF() {
  ReportService.exportReportPdf(filters.value, URL_DATA);
}

function formatDate(dateStr) {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
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

/* --- ESTILOS DE INSUMOS Y SANIDAD (CUSTOM PANELS) --- */
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

/* Fondo naranja muy suave */

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

/* Números Grandes (Big Data Look) */
.big-count {
  font-size: 1.8rem;
  font-weight: 800;
  margin-right: 8px;
}

.big-pct {
  font-size: 1.2rem;
  font-weight: 600;
}

/* Barras de Progreso Custom */
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
</style>