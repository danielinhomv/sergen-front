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
console.log("en la propiedad con el name:"+sessionPropertyStore.getName);
console.log("en la propiedad con el place:"+sessionPropertyStore.getPlace);
console.log("en la propiedad con el phone:"+sessionPropertyStore.getPhone);
console.log("en la propiedad con el owner:"+sessionPropertyStore.getOwner);
console.log("isWorked:"+sessionPropertyStore.isWorked);
console.log("chipId:"+sessionPropertyStore.getChipSerie);
console.log("bovine escaneado:"+ sessionPropertyStore.getBovine);
console.log("esta escaneado el bovino?:"+ sessionPropertyStore.onScanned);
console.log("control bovine escaneado:"+ sessionPropertyStore.getControlBovineId);
console.log("estado de conexion:"+ sessionPropertyStore.getConnectionState);

</script>
