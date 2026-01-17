<template>
  <LayoutApp>
    <div class="dashboard-container">

      <div class="dashboard-header mb-5">
        <div class="d-flex flex-column">
          <h1 class="page-title">Dashboard IATF</h1>
          <p class="page-subtitle">Indicadores de desempeño y análisis del protocolo</p>
        </div>

        <div class="d-flex align-items-center gap-3">
          <div class="filter-group">
            <button v-for="period in periods" :key="period.value" class="filter-btn"
              :class="{ active: selectedPeriod === period.value }" @click="selectPeriod(period.value)">
              <i :class="period.icon"></i>
              <span class="d-none d-md-inline">{{ period.label }}</span>
            </button>
          </div>

          <!-- <button class="btn-pdf-export" @click="generatePDF" :disabled="isGeneratingPdf">
            <i v-if="!isGeneratingPdf" class="fas fa-file-pdf"></i>
            <div v-else class="spinner-border spinner-border-sm" role="status"></div>
            <span>{{ isGeneratingPdf ? 'Generando...' : 'PDF' }}</span>
          </button> -->
        </div>
      </div>

      <div v-if="isGeneratingPdf" class="pdf-loading-overlay animate-fade">
        <div class="pdf-loading-card">
          <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;"></div>
          <h4 class="fw-bold text-dark mb-1">Generando Dashboard</h4>
          <p class="text-muted small mb-0">Compilando gráficos...</p>
        </div>
      </div>

      <div v-if="loading" class="d-flex justify-content-center align-items-center py-5" style="height: 400px;">
        <div class="spinner-border text-primary" role="status"></div>
      </div>

      <div v-else-if="error" class="alert alert-danger d-flex align-items-center p-3 mb-4 rounded-3 shadow-sm">
        <i class="fas fa-exclamation-circle me-3 fs-4"></i>
        <span class="fw-medium">{{ error }}</span>
      </div>

      <div v-else-if="data" class="content-wrapper animate-fade">

        <div class="row g-4 mb-5">
          <div class="col-lg-3 col-md-6">
            <MetricCard title="Hato Objetivo" :value="data.kpis.hato_objetivo" subtitle="animales programados"
              variant="dark" icon="fas fa-bullseye" />
          </div>
          <div class="col-lg-3 col-md-6" @click="navigateToReport('insemination-report')" 
               style="cursor: pointer;" title="Click para ver reporte de Inseminación">
            <MetricCard title="Cobertura IATF" :value="data.kpis.insemination.coverage_pct + '%'"
              :subtitle="data.kpis.insemination.count + ' inseminadas'" :progress="data.kpis.insemination.coverage_pct"
              variant="info" />
          </div>
          <div class="col-lg-3 col-md-6" @click="navigateToReport('confirmatory-ultrasound-report')" 
               style="cursor: pointer;" title="Click para ver reporte de Ecografía Confirmatoria">
            <MetricCard title="Preñez Confirmada" :value="data.kpis.confirmatory_ultrasound.count"
              :subtitle="data.kpis.confirmatory_ultrasound.coverage_pct + '% diagnosticado'"
              :progress="data.kpis.confirmatory_ultrasound.coverage_pct" variant="indigo" />
          </div>
          <div class="col-lg-3 col-md-6" @click="navigateToReport('birth-report')" 
               style="cursor: pointer;" title="Click para ver reporte de Nacimientos">
            <MetricCard title="Nacimientos" :value="data.kpis.births.count"
              :subtitle="data.kpis.births.coverage_pct + '% tasa final'" :progress="data.kpis.births.coverage_pct"
              variant="success" />
          </div>
        </div>

        <div class="row g-4 mb-5">
          <div class="col-lg-5">
            <div class="chart-card h-100">
              <div class="chart-header border-bottom pb-3 mb-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="chart-icon bg-blue-soft text-blue"><i class="fas fa-filter"></i></div>
                  <div>
                    <h5 class="fw-bold m-0 text-dark">Embudo del Protocolo</h5>
                    <p class="text-muted small m-0">Retención real por etapa</p>
                  </div>
                </div>
              </div>
              <div class="chart-body" style="height: 400px;">
                <VChart class="chart" :option="funnelOption" autoresize />
              </div>
            </div>
          </div>

          <div class="col-lg-7">
            <div class="chart-card h-100">
              <div class="chart-header border-bottom pb-3 mb-3">
                <div class="d-flex align-items-center gap-3">
                  <div class="chart-icon bg-purple-soft text-purple"><i class="fas fa-chart-line"></i></div>
                  <div>
                    <h5 class="fw-bold m-0 text-dark">Tendencia de Preñez</h5>
                    <p class="text-muted small m-0">Inseminación vs Confirmación</p>
                  </div>
                </div>
              </div>
              <div class="chart-body" style="height: 400px; position: relative;">
                <Line :data="seriesChartData" :options="seriesChartOptions" />
              </div>
            </div>
          </div>
        </div>

        <div class="row g-4 mb-5">
          <div class="col-lg-4 col-md-6">
            <div class="chart-card">
              <h6 class="text-uppercase text-muted fw-bold small mb-3 ls-1">Estado Ecografía</h6>
              <div class="chart-body-small">
                <Doughnut :data="getBreakdownChart(data.breakdowns.ultrasound_status, 'status')"
                  :options="doughnutOptions" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="chart-card">
              <h6 class="text-uppercase text-muted fw-bold small mb-3 ls-1">Confirmación Preñez</h6>
              <div class="chart-body-small">
                <Doughnut :data="getBreakdownChart(data.breakdowns.confirmatory_status, 'status')"
                  :options="doughnutOptions" />
              </div>
            </div>
          </div>
          <div class="col-lg-4 col-md-6">
            <div class="chart-card">
              <h6 class="text-uppercase text-muted fw-bold small mb-3 ls-1">Calidad de Celo</h6>
              <div class="chart-body-small">
                <Pie :data="getBreakdownChart(data.breakdowns.heat_quality, 'heat_quality')" :options="pieOptions" />
              </div>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <div class="chart-card">
              <div class="chart-header border-bottom pb-3 mb-3">
                <div class="d-flex align-items-center gap-3">
                  <span class="chart-icon bg-orange-soft text-orange">
                    <i class="fas fa-chart-bar"></i>
                  </span>
                  <div>
                    <h3 class="chart-title">Eficiencia por Etapa (% Cobertura)</h3>
                    <p class="chart-subtitle">Análisis de cumplimiento del protocolo (0 - 100%)</p>
                  </div>
                </div>
              </div>
              <div class="chart-body" style="height: 350px;">
                <Bar :data="coverageChartData" :options="coverageChartOptions" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  </LayoutApp>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSessionPropertyStore } from '@/store/SessionProperty.js';
import ReportService from '@/services/report/ReportService';

// UI Components
import LayoutApp from './LayoutApp.vue';
import MetricCard from '@/components/common/MetricCard.vue';

// --- ECHARTS (Para el Embudo) ---
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { FunnelChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';

// Registrar componentes de ECharts
use([CanvasRenderer, FunnelChart, TitleComponent, TooltipComponent, LegendComponent]);

// --- CHART.JS (Para el resto) ---
import { Line, Doughnut, Pie, Bar } from 'vue-chartjs';
import {
  Chart as ChartJS, Title, Tooltip, Legend, CategoryScale, LinearScale,
  LineElement, PointElement, ArcElement, BarElement
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  Title, Tooltip, Legend, CategoryScale, LinearScale,
  LineElement, PointElement, ArcElement, BarElement, ChartDataLabels
);

const router = useRouter();
const sessionPropertyStore = useSessionPropertyStore();
const data = ref(null);
const loading = ref(true);
const error = ref(null);
const isGeneratingPdf = ref(false);
const selectedPeriod = ref('week');
const URL_DATA = 'dashboard';

const periods = [
  { value: 'week', label: 'Semana', icon: 'fas fa-calendar-week' },
  { value: 'month', label: 'Mes', icon: 'fas fa-calendar-alt' },
  { value: 'year', label: 'Año', icon: 'fas fa-calendar' }
];

onMounted(async () => { await fetchData(); });

async function selectPeriod(period) {
  selectedPeriod.value = period;
  await fetchData();
}

async function fetchData() {
  loading.value = true;
  error.value = null;
  try {
    const filters = buildFilters();
    data.value = await ReportService.getReport(filters, URL_DATA);
  } catch (err) {
    error.value = "Error al cargar dashboard.";
    console.error(err);
  } finally {
    loading.value = false;
  }
}

function buildFilters() {
  const now = new Date();
  const year = now.getFullYear();
  const filters = {
    property_id: sessionPropertyStore.getPropertyId,
    control_id: sessionPropertyStore.getProtocolId,
    group_by: selectedPeriod.value
  };
  if (selectedPeriod.value === 'week') filters.filter_type = 'none';
  else if (selectedPeriod.value === 'month') {
    filters.filter_type = 'range';
    filters.date_start = `${year}-01-01`;
    filters.date_end = `${year}-12-31`;
  } else {
    filters.filter_type = 'from';
    filters.date_start = `${year - 2}-01-01`;
  }
  return filters;
}

function navigateToReport(routeName) {
  router.push({ name: routeName });
}

// async function generatePDF() {
//   isGeneratingPdf.value = true;
//   try {
//     const filters = buildFilters();
//     await ReportService.exportReportPdf(filters, URL_DATA);
//   } catch (err) { console.error(err); }
//   finally { isGeneratingPdf.value = false; }
// }

// --- 1. FUNNEL CHART (ECHARTS CONFIG) ---
const funnelOption = computed(() => {
  if (!data.value?.funnel) return {};

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)' // Muestra nombre: valor (porcentaje)
    },
    series: [
      {
        name: 'Embudo IATF',
        type: 'funnel',
        left: '10%',
        top: 10,
        bottom: 10,
        width: '80%',
        min: 0,
        max: data.value.funnel[0]?.count || 100, // El máximo es el primer paso (Hato Objetivo)
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending', // De mayor a menor
        gap: 2,
        label: {
          show: true,
          position: 'inside', // Etiqueta dentro
          formatter: '{c}', // Solo el número
          color: '#fff',
          fontWeight: 'bold'
        },
        labelLine: { length: 10, lineStyle: { width: 1, type: 'solid' } },
        itemStyle: { borderColor: '#fff', borderWidth: 1 },
        emphasis: { label: { fontSize: 20 } },
        // Datos mapeados del JSON
        data: data.value.funnel.map((item, index) => ({
          value: item.count,
          name: item.stage,
          itemStyle: {
            // Colores escalonados
            color: ['#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#f43f5e', '#f97316', '#10b981'][index]
          }
        }))
      }
    ]
  };
});

// --- 2. COVERAGE CHART (Chart.js Bar Vertical) ---
const coverageChartData = computed(() => {
  if (!data.value) return { labels: [], datasets: [] };
  const k = data.value.kpis;
  const stages = [
    { label: 'Presincronización', val: k.presynchronization.coverage_pct },
    { label: 'Ecografía', val: k.ultrasound.coverage_pct },
    { label: 'Retiro Implante', val: k.implant_retrieval.coverage_pct },
    { label: 'Inseminación', val: k.insemination.coverage_pct },
    { label: 'Confirmación', val: k.confirmatory_ultrasound.coverage_pct },
    { label: 'Diag. General', val: k.general_pregnancy_diagnosis.coverage_pct },
    { label: 'Partos', val: k.births.coverage_pct }
  ];

  return {
    labels: stages.map(s => s.label),
    datasets: [{
      label: 'Cobertura (%)',
      data: stages.map(s => s.val),
      backgroundColor: stages.map(s => s.val >= 90 ? '#10b981' : (s.val >= 70 ? '#f59e0b' : '#ef4444')),
      borderRadius: 6,
      barPercentage: 0.6
    }]
  };
});

const coverageChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { display: false }, datalabels: { color: '#334155', anchor: 'end', align: 'top', formatter: (val) => val + '%' } },
  scales: { y: { beginAtZero: true, max: 115, grid: { color: '#f1f5f9' }, ticks: { callback: (val) => val + '%' } }, x: { grid: { display: false } } }
};

// --- OTROS GRÁFICOS (Series & Donuts - Chart.js) ---
const seriesChartData = computed(() => {
  if (!data.value?.series) return { labels: [], datasets: [] };
  const allLabels = [...new Set([...data.value.series.inseminations.map(i => i.label), ...data.value.series.pregnant_general.map(p => p.label)])].sort();
  const mapData = (src) => allLabels.map(l => src.find(x => x.label === l)?.count || 0);

  return {
    labels: allLabels,
    datasets: [
      { label: 'Inseminadas', data: mapData(data.value.series.inseminations), borderColor: '#3b82f6', tension: 0.4, fill: true, backgroundColor: 'rgba(59,130,246,0.1)' },
      { label: 'Preñadas', data: mapData(data.value.series.pregnant_general), borderColor: '#10b981', tension: 0.4, fill: true, backgroundColor: 'rgba(16,185,129,0.1)' }
    ]
  };
});

const seriesChartOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { position: 'top', align: 'end' }, datalabels: { display: false } },
  scales: { y: { beginAtZero: true, grid: { color: '#f8fafc' } }, x: { grid: { display: false } } }
};

const doughnutOptions = {
  responsive: true, maintainAspectRatio: false,
  plugins: {
    legend: { position: 'right' }, datalabels: {
      color: '#fff', formatter: (val, ctx) => {
        const sum = ctx.dataset.data.reduce((a, b) => a + b, 0);
        return ((val / sum) * 100).toFixed(0) + '%';
      }
    }
  }
};
const pieOptions = { ...doughnutOptions };

function getBreakdownChart(breakdown, key) {
  if (!breakdown) return { labels: [], datasets: [] };
  const labels = breakdown.map(i => translate(i[key]));
  const values = breakdown.map(i => i.count);
  return { labels, datasets: [{ data: values, backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'] }] };
}

function translate(val) {
  const dict = {
    'pregnant': 'Preñada',
    'implanted': 'En Protocolo',
    'retrieved': 'Retirado',
    'lost': 'Perdido',
    'empty': 'Vacía',
    'discart': 'Descarte',
    'male': 'Macho',
    'female': 'Hembra',
    'normal': 'Normal',
    'abort': 'Aborto'
  };
  return dict[val] || val;
}
</script>

<style scoped>
/* Estilos reutilizados (Header, Buttons, Cards) */
.dashboard-container {
  font-family: 'Inter', sans-serif;
  color: #1e293b;
  max-width: 1600px;
  margin: 0 auto;
}

.page-title {
  font-weight: 800;
  font-size: 2rem;
  color: #0f172a;
  margin-bottom: 0.2rem;
}

.page-subtitle {
  color: #64748b;
  font-size: 1rem;
  margin: 0;
}

.filter-group {
  background: white;
  padding: 4px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  display: flex;
  gap: 4px;
}

.filter-btn {
  border: none;
  background: transparent;
  padding: 8px 16px;
  border-radius: 8px;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
}

.filter-btn:hover {
  background: #f8fafc;
  color: #334155;
}

.filter-btn.active {
  background: #eff6ff;
  color: #2563eb;
}

.btn-pdf-export {
  border: 1px solid #ef4444;
  background: white;
  color: #ef4444;
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 600;
  display: flex;
  gap: 8px;
}

.btn-pdf-export:hover {
  background: #fef2f2;
}

.chart-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  height: 100%;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
}

.chart-icon {
  width: 42px;
  height: 42px;
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

.bg-purple-soft {
  background: #f5f3ff;
}

.text-purple {
  color: #7c3aed;
}

.bg-orange-soft {
  background: #fff7ed;
}

.text-orange {
  color: #ea580c;
}

.pdf-loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.pdf-loading-card {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
}

.animate-fade {
  animation: fadeIn 0.6s ease-out;
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

/* Clase necesaria para que vue-echarts ocupe el espacio */
.chart {
  height: 100%;
  width: 100%;
}

/* Hover effect for clickable metric cards */
.col-lg-3.col-md-6[style*="cursor: pointer"] {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.col-lg-3.col-md-6[style*="cursor: pointer"]:hover {
  transform: translateY(-4px);
}

.col-lg-3.col-md-6[style*="cursor: pointer"]:active {
  transform: translateY(-2px);
}

</style>