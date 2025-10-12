import { createRouter, createWebHistory } from 'vue-router';
//import { createSessionPropertyGuard } from './SessionProperty-guard.js'

import DashboardApp from '../components/DashboardApp.vue';
import Login from '../components/LoginApp.vue';
import SelectProperty from '../components/SelectProperty.vue';

import InseminationReport from '../components/report/InseminationReport.vue';
import UltraSoundReport from '../components/report/UltraSoundReport.vue';
import ConfirmatoryUltrasoundReport from '../components/report/ConfirmatoryUltrasoundReport.vue';
import GeneralPalpationReport from '../components/report/GeneralPalpationReport.vue';
import PresynchronizationReport from '../components/report/PresynchronizationReport.vue';
import ImplantRemovalReport from '../components/report/ImplantRemovalReport.vue';
import BirthReport from '../components/report/BirthReport.vue';

import AccountManagement from '../components/management/AccountManagement.vue';
import PropertyManagement from '../components/management/PropertyManagement.vue';

import InseminationManagement from '../components/management/InseminationManagement.vue';
import BirhManagement from '../components/management/BirhManagement.vue';
import ConfirmatoryUltrasoundManagement from '../components/management/ConfirmatoryUltrasoundManagement.vue';
import GeneralPalpationManagement from '../components/management/GeneralPalpationManagement.vue';
import ImplantRemovalManagement from '../components/management/ImplantRemovalManagement.vue';
import PresynchronizationManagement from '../components/management/PresynchronizationManagement.vue';
import UltraSoundManagement from '../components/management/UltraSoundManagement.vue';

import LayoutReport from '../components/report/LayoutReport.vue';
import LayoutManagement from '../components/management/LayoutManagement.vue'; 

const routes = [
  { path: '/', name: 'dashboard', component: DashboardApp },
  { path: '/login', name: 'login', component: Login },
  { path: '/management/account', name: 'account-management', component: AccountManagement },
  { path: '/select-property', name: 'select-property', component: SelectProperty },

  {
    path: '/reports',
    component: LayoutReport,
    children: [
      { path: '/reports/insemination', name: 'insemination-report', component: InseminationReport },
      { path: '/reports/UltraSound', name: 'ultrasound-report', component: UltraSoundReport },
      { path: '/reports/confirmatory-ultrasound', name: 'confirmatory-ultrasound-report', component: ConfirmatoryUltrasoundReport },
      { path: '/reports/Birth', name: 'birth-report', component: BirthReport },
      { path: '/reports/Presynchronization', name: 'presynchronization-report', component: PresynchronizationReport },
      { path: '/reports/GeneralPalpation', name: 'general-palpation-report', component: GeneralPalpationReport },
      { path: '/reports/ImplantRemoval', name: 'implant-removal-report', component: ImplantRemovalReport },
     
    ],
  },

  {
    path: '/management',
    component: LayoutManagement, // Reutiliza LayoutReport para la sección de gestión
    children: [
      { path: '/management/insemination', name: 'insemination-management', component: InseminationManagement },
      { path: '/management/birth', name: 'birth-management', component: BirhManagement },
      { path: '/management/confirmatory-ultrasound', name: 'confirmatory-ultrasound-management', component: ConfirmatoryUltrasoundManagement },
      { path: '/management/general-palpation', name: 'general-palpation-management', component: GeneralPalpationManagement },
      { path: '/management/implant-removal', name: 'implant-removal-management', component: ImplantRemovalManagement },
      { path: '/management/presynchronization', name: 'presynchronization-management', component: PresynchronizationManagement },
      { path: '/management/ultrasound', name: 'ultrasound-management', component: UltraSoundManagement },
    ],
  },
  
  { path: '/management/property', name: 'property-management', component: PropertyManagement },

];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//createSessionPropertyGuard(router);

export default router;
