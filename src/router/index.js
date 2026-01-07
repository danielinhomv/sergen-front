import { createRouter, createWebHistory } from 'vue-router';

// Imports de componentes (se mantienen igual que los tuyos)
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
import HistorialBovineReport from '@/components/report/HistorialBovineReport.vue';
import LayoutReport from '../components/report/LayoutReport.vue';
import LayoutManagement from '../components/management/LayoutManagement.vue'; 

const routes = [
  // --- RUTAS DE ACCESO ---
  { 
    path: '/login', 
    name: 'login', 
    component: Login, 
    meta: { requiresAuth: false } 
  },
  { 
    path: '/select-property', 
    name: 'select-property', 
    component: SelectProperty, 
    meta: { requiresAuth: true, requiresWorkSession: false } 
  },

  // --- RUTAS DE TRABAJO (Requieren Login y Propiedad) ---
  { 
    path: '/', 
    name: 'dashboard', 
    component: DashboardApp, 
    meta: { requiresAuth: true, requiresWorkSession: true } 
  },
  { 
    path: '/management/account', 
    name: 'account-management', 
    component: AccountManagement, 
    meta: { requiresAuth: true, requiresWorkSession: true } 
  },
  { 
    path: '/management/property', 
    name: 'property-management', 
    component: PropertyManagement, 
    meta: { requiresAuth: true, requiresWorkSession: true } 
  },
  { 
    path: '/reports/historial-bovine', 
    name: 'historial-bovine-report', 
    component: HistorialBovineReport, 
    meta: { requiresAuth: true, requiresWorkSession: true } 
  },

  // --- GRUPO REPORTES ---
  {
    path: '/reports',
    component: LayoutReport,
    meta: { requiresAuth: true, requiresWorkSession: true },
    children: [
      { path: 'insemination', name: 'insemination-report', component: InseminationReport },
      { path: 'UltraSound', name: 'ultrasound-report', component: UltraSoundReport },
      { path: 'confirmatory-ultrasound', name: 'confirmatory-ultrasound-report', component: ConfirmatoryUltrasoundReport },
      { path: 'Birth', name: 'birth-report', component: BirthReport },
      { path: 'Presynchronization', name: 'presynchronization-report', component: PresynchronizationReport },
      { path: 'GeneralPalpation', name: 'general-palpation-report', component: GeneralPalpationReport },
      { path: 'ImplantRemoval', name: 'implant-removal-report', component: ImplantRemovalReport },
    ],
  },

  // --- GRUPO GESTIÓN ---
  {
    path: '/management',
    component: LayoutManagement,
    meta: { requiresAuth: true, requiresWorkSession: true },
    children: [
      { path: 'insemination', name: 'insemination-management', component: InseminationManagement },
      { path: 'birth', name: 'birth-management', component: BirhManagement },
      { path: 'confirmatory-ultrasound', name: 'confirmatory-ultrasound-management', component: ConfirmatoryUltrasoundManagement },
      { path: 'general-palpation', name: 'general-palpation-management', component: GeneralPalpationManagement },
      { path: 'implant-removal', name: 'implant-removal-management', component: ImplantRemovalManagement },
      { path: 'presynchronization', name: 'presynchronization-management', component: PresynchronizationManagement },
      { path: 'ultrasound', name: 'ultrasound-management', component: UltraSoundManagement },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;