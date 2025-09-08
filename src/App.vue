
<template>
 <AccountManagement/>
</template>

<script>
import AccountManagement from './components/management/AccountManagement.vue';

export default {
  name: 'App',
  components: {
    AccountManagement, // Esto registra el componente para que pueda ser usado en el template
  },
};
</script>
