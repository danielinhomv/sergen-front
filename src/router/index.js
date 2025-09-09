import { createRouter, createWebHistory } from 'vue-router';
import DashboardApp from '../components/DashboardApp.vue';
import Login from '../components/LoginApp.vue';
import SelectProperty from '../components/SelectProperty.vue';
import InseminationReport from '../components/report/InseminationReport.vue';
import UltraSoundReport from '../components/report/UltraSoundReport.vue';
import ConfirmatoryUltrasoundReport from '../components/report/ConfirmatoryUltrasoundReport.vue';
import GeneralPalpationReport from '../components/report/GeneralPalpationReport.vue';
import PresynchronizationReport from '../components/report/PresynchronizationReport.vue';
import implantRemovalReport from '../components/report/implantRemovalReport.vue';
import BirthReport from '../components/report/BirthReport.vue';
import AccountManagement from '../components/management/AccountManagement.vue';
import InseminationManagement from '../components/management/InseminationManagement.vue';
import PropertyManagement from '../components/management/PropertyManagement.vue';


const routes = [
  { path: '/', name: 'dashboard', component: DashboardApp },
  { path: '/login', name: 'login', component: Login },
  { path: '/management/account', name: 'account-management', component: AccountManagement },
  { path: '/select-property', name: 'select-property', component: SelectProperty },
  { path: '/reports/insemination', name: 'insemination-report', component: InseminationReport },
  { path: '/reports/UltraSoundReport', name: 'ultrasound-report', component: UltraSoundReport },
  { path: '/reports/confirmatory-ultrasound', name: 'confirmatory-ultrasound-report', component: ConfirmatoryUltrasoundReport },
  { path: '/reports/BirthReport', name: 'birth-report', component: BirthReport },
  { path: '/PresynchronizationReport', name: 'presynchronization-report', component: PresynchronizationReport },
  { path: '/reports/GeneralPalpationReport', name: 'general-palpation-report', component: GeneralPalpationReport },
  { path: 'ImplantRemovalReport', name: 'implant-removal-report', component: implantRemovalReport },
  { path: '/management/insemination', name: 'insemination-management', component: InseminationManagement },
  { path: '/management/property', name: 'property-management', component: PropertyManagement },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
