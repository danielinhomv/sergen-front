<template>
  <div class="report-content-inner">
    <div class="report-header-flex mb-4">
      <div>
        <h3 class="report-title">Presincronización</h3>
        <p class="report-subtitle">Panel de control y seguimiento de aplicaciones</p>
      </div>
      
      <button class="pdf-download-btn" @click="generatePDF">
        <i class="fas fa-file-pdf"></i>
        <span>Descargar PDF</span>
      </button>
    </div>

    <div class="stats-row mb-4">
      <div class="stat-box apply-border">
        <div class="stat-main">
          <span class="stat-label">Aplicadas</span>
          <span class="stat-number">45</span>
        </div>
        <div class="stat-footer">Animales con tratamiento completado</div>
      </div>

      <div class="stat-box pending-border">
        <div class="stat-main">
          <span class="stat-label">Por Aplicar</span>
          <span class="stat-number">12</span>
        </div>
        <div class="stat-footer">Pendientes de aplicación</div>
      </div>
    </div>

    <div class="table-container-styled">
      <table class="styled-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vacuna Reprod.</th>
            <th>Sincrogest</th>
            <th>Antiparasitario</th>
            <th>Vit/Min</th>
            <th>Fecha Aplicación</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in fakeRecords" :key="item.id">
            <td><span class="id-badge">#{{ item.id }}</span></td>
            <td>{{ item.reproductive_vaccine || '—' }}</td>
            <td>{{ item.sincrogest_product || '—' }}</td>
            <td>{{ item.antiparasitic_product || '—' }}</td>
            <td>
              <span :class="['status-pill', item.vitamins_and_minerals ? 'pill-yes' : 'pill-no']">
                {{ item.vitamins_and_minerals ? 'Sí' : 'No' }}
              </span>
            </td>
            <td class="date-cell">{{ item.application_date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div class="report-info-footer">
      <i class="fas fa-info-circle me-1"></i> Mostrando los últimos 10 registros del protocolo.
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const fakeRecords = ref([
  { id: 101, reproductive_vaccine: 'Bovi-Shield Gold', sincrogest_product: 'DIB 0.5g', antiparasitic_product: 'Ivermectina', vitamins_and_minerals: true, application_date: '2023-12-01' },
  { id: 102, reproductive_vaccine: 'Leptovoid-H', sincrogest_product: 'Cronipres', antiparasitic_product: 'Albendazol', vitamins_and_minerals: false, application_date: '2023-12-02' },
  { id: 103, reproductive_vaccine: 'Bovilis IBR', sincrogest_product: 'DIB 1.0g', antiparasitic_product: 'Doramectina', vitamins_and_minerals: true, application_date: '2023-12-03' },
  { id: 104, reproductive_vaccine: 'Sincrovax', sincrogest_product: 'Sincrosurf', antiparasitic_product: 'Fenbendazol', vitamins_and_minerals: false, application_date: '2023-12-04' },
  { id: 105, reproductive_vaccine: 'Bioabortogen', sincrogest_product: 'DIB 0.5g', antiparasitic_product: 'Ivermectina', vitamins_and_minerals: true, application_date: '2023-12-05' },
  { id: 106, reproductive_vaccine: 'Bovi-Shield Gold', sincrogest_product: 'Cronipres', antiparasitic_product: 'Moxidectina', vitamins_and_minerals: true, application_date: '2023-12-06' },
  { id: 107, reproductive_vaccine: 'Leptovoid-H', sincrogest_product: 'Cronipres', antiparasitic_product: 'Ivermectina', vitamins_and_minerals: false, application_date: '2023-12-07' },
  { id: 108, reproductive_vaccine: 'Bioabortogen', sincrogest_product: 'DIB 0.5g', antiparasitic_product: 'Praziquantel', vitamins_and_minerals: true, application_date: '2023-12-08' },
  { id: 109, reproductive_vaccine: 'Bovilis IBR', sincrogest_product: 'Sincrosurf', antiparasitic_product: 'Albendazol', vitamins_and_minerals: true, application_date: '2023-12-09' },
  { id: 110, reproductive_vaccine: 'Bovi-Shield Gold', sincrogest_product: 'DIB 1.0g', antiparasitic_product: 'Ivermectina', vitamins_and_minerals: false, application_date: '2023-12-10' },
]);

const generatePDF = () => {
  window.print();
};
</script>

<style scoped>
/* CABECERA */
.report-header-flex {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.report-title {
  color: #1a4d2e;
  font-weight: 800;
  margin: 0;
}

.report-subtitle {
  color: #888;
  font-size: 0.9rem;
}

.pdf-download-btn {
  background-color: #d32f2f;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
  box-shadow: 0 4px 6px rgba(211, 47, 47, 0.2);
}

.pdf-download-btn:hover {
  background-color: #b71c1c;
  transform: translateY(-2px);
}

/* CARDS DE ESTADÍSTICAS */
.stats-row {
  display: flex;
  gap: 20px;
}

.stat-box {
  flex: 1;
  background: #fdfdfd;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
}

.apply-border { border-left: 6px solid #4caf50; }
.pending-border { border-left: 6px solid #ffa000; }

.stat-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-weight: 700;
  color: #444;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.stat-number {
  font-size: 2.2rem;
  font-weight: 800;
  color: #1a4d2e;
}

.stat-footer {
  font-size: 0.8rem;
  color: #999;
  margin-top: 5px;
}

/* TABLA ESTILIZADA (EL DISEÑO QUE TE GUSTÓ) */
.table-container-styled {
  background: white;
  border-radius: 10px;
  overflow: hidden; /* Para que los bordes redondeados funcionen */
  border: 1px solid #e0e0e0;
}

.styled-table {
  width: 100%;
  border-collapse: collapse;
}

.styled-table thead tr {
  background-color: #4caf50; /* Verde sólido */
  color: #ffffff;
  text-align: left;
  font-weight: bold;
}

.styled-table th {
  padding: 15px;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.styled-table td {
  padding: 12px 15px;
  border-bottom: 1px solid #f3f3f3;
  color: #444;
  font-size: 0.9rem;
}

.styled-table tbody tr:hover {
  background-color: #f9f9f9;
}

/* BADGES Y DETALLES */
.id-badge {
  background-color: #f0f4f2;
  color: #2e7d32;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: bold;
}

.status-pill {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: bold;
}

.pill-yes { background-color: #e8f5e9; color: #2e7d32; }
.pill-no { background-color: #ffebee; color: #c62828; }

.date-cell {
  color: #777;
  font-family: monospace;
}

.report-info-footer {
  margin-top: 1rem;
  font-size: 0.8rem;
  color: #bbb;
  text-align: left;
}
</style>