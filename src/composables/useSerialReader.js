// import { ref, computed } from 'vue';
// import { useSessionPropertyStore } from '@/store/SessionProperty';
// import { BovineService } from '@/services/management/BovineService';
// import { ControlBovineService } from '@/services/management/ControlBovineService';
// import { ControlBovine } from '@/model/management/ControlBovine';

// let lastReadTime = 0;
// let lastChip = '';

// export function useSerialReader() {
//   const port = ref(null);
//   const reader = ref(null);
//   const isConnecting = ref(false);
//   const chipId = ref(null);
  
//   const sessionPropertyStore = useSessionPropertyStore();
//   const bovineService = new BovineService();
//   const controlBovineService = new ControlBovineService();

//   const BAUD_RATE = 9600;
//   const TEXT_DECODER = new TextDecoder();
//   const MOCK_MODE = false; 

//   const connectionState = computed({
//     get: () => sessionPropertyStore.connectionState,
//     set: (val) => sessionPropertyStore.setConnectionState(val)
//   });

//   const propertyId = sessionPropertyStore.getPropertyId;

//   const connectionStatus = computed(() => {
//     if (connectionState.value === 'connected') return 'Lector Conectado y Listo.';
//     if (connectionState.value === 'connecting') return 'Esperando selección de puerto...';
//     if (!('serial' in navigator) && !MOCK_MODE) return 'ERROR: Web Serial API no soportada.';
//     return 'Lector Desconectado. Haga clic para conectar.';
//   });

//   const connectionClass = computed(() => {
//     if (connectionState.value === 'connected') return 'bg-success text-white';
//     if (connectionState.value === 'connecting') return 'bg-info text-white';
//     return 'bg-danger text-white';
//   });

//   const connectionIcon = computed(() => {
//     if (connectionState.value === 'connected') return 'bi bi-wifi';
//     if (connectionState.value === 'connecting') return 'bi bi-three-dots';
//     return 'bi bi-x-circle';
//   });

//   const buttonClass = computed(() => {
//     if (connectionState.value === 'connected') return 'btn-success';
//     if (connectionState.value === 'connecting') return 'btn-info';
//     return 'btn-primary';
//   });

//   const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

//   async function connectReader() {
//     if (MOCK_MODE) {
//       isConnecting.value = true;
//       connectionState.value = 'connecting';
//       await sleep(1000); 
//       connectionState.value = 'connected';
//       isConnecting.value = false;
//       return;
//     }

//     if (!('serial' in navigator)) return;
    
//     await disconnectReader();

//     isConnecting.value = true;
//     connectionState.value = 'connecting';

//     try {
//       port.value = await navigator.serial.requestPort();
//       await port.value.open({ baudRate: BAUD_RATE });
//       connectionState.value = 'connected';
//       readSerialData();
//     } catch (error) {
//       connectionState.value = 'disconnected';
//       port.value = null;
//     } finally {
//       isConnecting.value = false;
//     }
//   }

//   async function disconnectReader() {
//     if (reader.value) {
//         try {
//             await reader.value.cancel();
//             reader.value.releaseLock();
//         } catch (e) {}
//         reader.value = null;
//     }
//     if (port.value) {
//         try {
//             await port.value.close();
//         } catch (e) {}
//         port.value = null;
//     }
//     connectionState.value = 'disconnected';
//   }

//   async function executeLogic(buffer) {
//     try {
//       const cleanSerie = buffer.trim();
//       if (!cleanSerie) return;

//       const now = Date.now();
//       if (cleanSerie === lastChip && (now - lastReadTime) < 3000) {
//         return;
//       }

//       lastReadTime = now;
//       lastChip = cleanSerie;

//       chipId.value = cleanSerie;
//       sessionPropertyStore.setChipSerie(cleanSerie);

//       const bovine = await bovineService.getBySerie(cleanSerie, propertyId);

//       if (!bovine) {
//         sessionPropertyStore.clearBovine();
//         return;
//       }

//       sessionPropertyStore.setBovine(bovine);

//       const protocolId = sessionPropertyStore.getProtocolId;
      
//       const controlData = new ControlBovine({
//         bovine_id: bovine.id,
//         control_id: protocolId,
//         property_id: propertyId
//       });
      
//       const relation = await controlBovineService.createControlBovine(controlData);

//       if (relation && relation.id) {
//         sessionPropertyStore.setControlBovineId(relation.id);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   }

//   async function readSerialData() {
//     if (!port.value || !port.value.readable) return;
    
//     reader.value = port.value.readable.getReader();
    
//     try {
//       while (connectionState.value === 'connected') {
//         const { value, done } = await reader.value.read();
//         if (done) break;
        
//         const decoded = TEXT_DECODER.decode(value);
//         if (decoded) {
//           await executeLogic(decoded);
//         }
//       }
//     } catch (error) {
//       await disconnectReader();
//     } finally {
//       if (reader.value) {
//         reader.value.releaseLock();
//       }
//     }
//   }

//   return {
//     connectionState,
//     connectionStatus,
//     connectionClass,
//     connectionIcon,
//     buttonClass,
//     isConnecting,
//     connectReader,
//     disconnectReader,
//     chipId,
//     sessionPropertyStore
//   };
// }

// modo prueba
import { ref, computed } from 'vue';
import { useSessionPropertyStore } from '@/store/SessionProperty';
import { BovineService } from '@/services/management/BovineService';
import { ControlBovineService } from '@/services/management/ControlBovineService';
import { ControlBovine } from '@/model/management/ControlBovine';

export function useSerialReader() {
  const port = ref(null);
  const reader = ref(null);
  const isConnecting = ref(false);
  const chipId = ref(null);
  
  const sessionPropertyStore = useSessionPropertyStore();

  // Accedemos directamente a la variable persistente del store
  const connectionState = computed({
    get: () => sessionPropertyStore.connectionState,
    set: (val) => sessionPropertyStore.setConnectionState(val)
  });

  const bovineService = new BovineService();
  const controlBovineService = new ControlBovineService();

  const propertyId = sessionPropertyStore.getPropertyId;

  const BAUD_RATE = 9600;
  const TEXT_DECODER = new TextDecoder();

  // --- CONFIGURACIÓN DE PRUEBAS ---
  const MOCK_MODE = true; 
  const TEST_SERIE = 'B-0015';
  const TEST_CONTROL_ID = 21;

  const connectionStatus = computed(() => {
    if (connectionState.value === 'connected') return 'Lector Conectado y Listo.';
    if (connectionState.value === 'connecting') return 'Esperando selección de puerto...';
    if (!('serial' in navigator) && !MOCK_MODE) return 'ERROR: Web Serial API no soportada.';
    return 'Lector Desconectado. Haga clic para conectar.';
  });

  const connectionClass = computed(() => {
    if (connectionState.value === 'connected') return 'bg-success text-white';
    if (connectionState.value === 'connecting') return 'bg-info text-white';
    return 'bg-danger text-white';
  });

  const connectionIcon = computed(() => {
    if (connectionState.value === 'connected') return 'bi bi-wifi';
    if (connectionState.value === 'connecting') return 'bi bi-three-dots';
    return 'bi bi-x-circle';
  });

  const buttonClass = computed(() => {
    if (connectionState.value === 'connected') return 'btn-success';
    if (connectionState.value === 'connecting') return 'btn-info';
    return 'btn-primary';
  });

  const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  async function connectReader() {
    if (MOCK_MODE) {
      isConnecting.value = true;
      connectionState.value = 'connecting';
      await sleep(1000); 

      connectionState.value = 'connected';
      isConnecting.value = false;

      console.log("🚀 MODO PRUEBA ACTIVO: Lógica persistente.");
      executeLogic(TEST_SERIE); 
      return;
    }

    if (!('serial' in navigator)) return;
    isConnecting.value = true;
    connectionState.value = 'connecting';
    try {
      port.value = await navigator.serial.requestPort();
      await port.value.open({ baudRate: BAUD_RATE });
      connectionState.value = 'connected';
      readSerialData();
    } catch (error) {
      connectionState.value = 'disconnected';
      port.value = null;
    } finally {
      isConnecting.value = false;
    }
  }

  async function disconnectReader() {
    // Si hay un lector real, cerramos el stream
    if (reader.value) {
        await reader.value.cancel();
        reader.value.releaseLock();
        reader.value = null;
    }
    if (port.value) {
        await port.value.close();
        port.value = null;
    }
    connectionState.value = 'disconnected';
    // Nota: Ya no reseteamos el chipSerie aquí para que persista en el Dashboard
  }

  async function executeLogic(buffer) {
    try {
      chipId.value = buffer;
      sessionPropertyStore.setChipSerie(buffer);
      console.log("Chip en store:", sessionPropertyStore.getChipSerie);

      const bovine = await bovineService.getBySerie(buffer, propertyId);

      if (!bovine) {
        console.warn("❌ Bovino no encontrado.");
        sessionPropertyStore.clearBovine();
        return;
      }

      sessionPropertyStore.setBovine(bovine);

      const protocolId = MOCK_MODE ? TEST_CONTROL_ID : sessionPropertyStore.getProtocolId;
      const controlData = new ControlBovine({
        bovine_id: bovine.id,
        control_id: protocolId,
        property_id: propertyId
      });
      
      const relation = await controlBovineService.createControlBovine(controlData);

      if (relation && relation.id) {
        sessionPropertyStore.setControlBovineId(relation.id);
        console.log("✅ Vinculado ID:", relation.id);
      }
    } catch (error) {
      console.error("❌ Error lógica:", error);
    }
  }

  async function readSerialData() {
    if (!port.value || !port.value.readable) return;
    reader.value = port.value.readable.getReader();
    try {
      while (connectionState.value === 'connected') {
        const { value, done } = await reader.value.read();
        if (done) break;
        const buffer = TEXT_DECODER.decode(value, { stream: true }).trim();
        if (buffer) executeLogic(buffer); 
      }
    } catch (error) {
      connectionState.value = 'disconnected';
    } finally {
        if (reader.value) {
            reader.value.releaseLock();
        }
    }
  }

  // HEMOS ELIMINADO onBeforeUnmount PARA QUE LA CONEXIÓN NO SE CORTE AL CAMBIAR DE PÁGINA

  return {
    connectionState, connectionStatus, connectionClass, connectionIcon,
    buttonClass, isConnecting, connectReader, disconnectReader,
    chipId, sessionPropertyStore
  };
}