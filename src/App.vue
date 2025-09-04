
<template>
 <DashboardApp/>
</template>

<script>
import DashboardApp from './components/DashboardApp.vue';
export default {
  name: 'App',
  components: {
    DashboardApp, // Esto registra el componente para que pueda ser usado en el template
  },
};
</script>
