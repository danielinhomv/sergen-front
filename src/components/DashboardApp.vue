<template>
  <LayoutApp>
    <div class="report-section">
    <p>Este es el contenido del dashboard.</p>
    </div>
  </LayoutApp>
</template>

<script setup>
import LayoutApp from './LayoutApp.vue';
import { useSessionPropertyStore } from '@/store/SessionProperty.js';
    
const sessionPropertyStore = useSessionPropertyStore();
console.log("se inicio un trabajo correctamente !!")
console.log("en la propiedad con el id:"+sessionPropertyStore.getPropertyId);
console.log("en la propiedad con el protocoloId:"+sessionPropertyStore.getProtocolId);
  
console.log("isWorked:"+sessionPropertyStore.isWorked);


</script>
