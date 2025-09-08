import { createRouter, createWebHistory } from 'vue-router';
import DashboardApp from '../components/DashboardApp.vue';
import Login from '../components/LoginApp.vue';
import SelectProperty from '../components/SelectProperty.vue';
import InseminationReport from '../components/report/InseminationReport.vue';
import AccountManagement from '../components/management/AccountManagement.vue';
import InseminationManagement from '../components/management/InseminationManagement.vue';

const routes = [
  { path: '/', name: 'dashboard', component: DashboardApp },
  { path: '/login', name: 'login', component: Login },
  { path: '/management/account', name: 'account-management', component: AccountManagement },
  { path: '/select-property', name: 'select-property', component: SelectProperty },
  { path: '/reports/insemination', name: 'insemination-report', component: InseminationReport },
  { path: '/management/insemination', name: 'insemination-management', component: InseminationManagement },
  // Agrega aquí otras rutas
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
