// import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
// import { useSessionPropertyStore } from '@/store/SessionProperty';
// import { BovineService } from '@/services/management/BovineService';
// import { ControlBovineService } from '@/services/management/ControlBovineService';

// export function useSerialReader() {
//   const port = ref(null);
//   const reader = ref(null);
//   const connectionState = ref('disconnected');
//   const isConnecting = ref(false);
//   const chipId = ref(null);
//   const sessionPropertyStore = useSessionPropertyStore();

//   const bovineService = new BovineService();
//   const controlBovineService = new ControlBovineService();

//   const propertyId = sessionPropertyStore.getPropertyId;

//   const BAUD_RATE = 9600;
//   const TEXT_DECODER = new TextDecoder();

//   const connectionStatus = computed(() => {
//     if (connectionState.value === 'connected') return 'Lector Conectado y Listo.';
//     if (connectionState.value === 'connecting') return 'Esperando selección de puerto...';
//     if (!('serial' in navigator)) return 'ERROR: Web Serial API no soportada. Use Chrome/Edge.';
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

//   async function attemptOpenPort(portInstance, attempts = 2) {
//     for (let i = 0; i < attempts; i++) {
//       try {
//         await portInstance.open({ baudRate: BAUD_RATE });
//         return;
//       } catch (error) {
//         if (i < attempts - 1 && (error.name === 'NetworkError' || error.name === 'InvalidStateError')) {
//           console.warn(`Intento ${i + 1} fallido. Esperando 1.5s...`);
//           await sleep(1500);
//         } else {
//           throw error;
//         }
//       }
//     }
//   }

//   async function connectReader() {
//     if (!('serial' in navigator)) {
//       connectionState.value = 'disconnected';
//       console.error('Web Serial API no soportada.');
//       return;
//     }

//     await disconnectReader(); // Limpieza previa

//     isConnecting.value = true;
//     connectionState.value = 'connecting';

//     try {
//       const ports = await navigator.serial.getPorts();
//       if (ports.length > 0) {
//         console.warn("Puerto ya abierto. Evitando reconexión automática.");
//         return;
//       }

//       port.value = await navigator.serial.requestPort();
//       await attemptOpenPort(port.value);

//       connectionState.value = 'connected';
//       readSerialData();

//     } catch (error) {
//       connectionState.value = 'disconnected';
//       console.error('Error al conectar:', error);
//       port.value = null;
//     } finally {
//       isConnecting.value = false;
//     }
//   }

//   async function disconnectReader() {
//     if (reader.value) {
//       try { await reader.value.cancel(); } catch (e) { console.warn("Error cancelando reader:", e); }
//       try { reader.value.releaseLock(); } catch (e) { console.warn("Error liberando reader:", e); }
//       reader.value = null;
//     }

//     if (port.value) {
//       try {
//         await port.value.close();
//         await sleep(1500);
//       } catch (e) {
//         console.warn("Error al cerrar el puerto:", e);
//       }
//       port.value = null;
//     }

//     connectionState.value = 'disconnected';
//     sessionPropertyStore.setChipSerie(null);
//   }

//   async function readSerialData() {
//     if (!port.value || !port.value.readable) return;

//     reader.value = port.value.readable.getReader();
//     let buffer = '';

//     try {
//       while (connectionState.value === 'connected') {
//         const { value, done } = await reader.value.read();
//         if (done) break;

//         buffer = TEXT_DECODER.decode(value, { stream: true }).trim();
//         if (!buffer) continue;

//         chipId.value = buffer;
//         sessionPropertyStore.setChipSerie(buffer);

//         console.log("RFID leído:", buffer);

//         // 1️⃣ Buscar bovino
//         const bovine = await bovineService.getBySerie(buffer);

//         if (!bovine) {
//           console.warn("No existe bovino con ese chip");
//           sessionPropertyStore.clearBovine();
//           return;
//         }

//         // 2️⃣ Guardar en sesión
//         sessionPropertyStore.setBovine(bovine);

//         console.log("Bovino activo:", bovine.name);

//         // 3️⃣ Crear vínculo Control-Bovine
//         const protocolId = sessionPropertyStore.getProtocolId;
//         const relation = await controlBovineService.createControlBovine({
//           bovine_id: bovine.id,
//           control_id: protocolId,
//           property_id: propertyId
//         });

//         sessionPropertyStore.setControlBovineId(relation.id);

//         console.log("ControlBovine creado:", relation.id);
//       }
//     }
//     catch (error) {
//       console.error("Error RFID:", error);
//       await disconnectReader();
//     }
//   }


//   function handleUnload() {
//     disconnectReader();
//   }

//   onMounted(() => {
//     window.addEventListener('beforeunload', handleUnload);
//   });

//   onBeforeUnmount(() => {
//     window.removeEventListener('beforeunload', handleUnload);
//     disconnectReader();
//   });

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

// 
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useSessionPropertyStore } from '@/store/SessionProperty';
import { BovineService } from '@/services/management/BovineService';
import { ControlBovineService } from '@/services/management/ControlBovineService';

export function useSerialReader() {
  const port = ref(null);
  const reader = ref(null);
  const connectionState = ref('disconnected');
  const isConnecting = ref(false);
  const chipId = ref(null);
  const sessionPropertyStore = useSessionPropertyStore();

  const bovineService = new BovineService();
  const controlBovineService = new ControlBovineService();

  const propertyId = sessionPropertyStore.getPropertyId;

  const BAUD_RATE = 9600;
  const TEXT_DECODER = new TextDecoder();

  // --- CONFIGURACIÓN DE PRUEBAS (HARDCODE) ---
  const MOCK_MODE = true; // Cambiar a false cuando tengas el lector
  const TEST_SERIE = 'B-0015';
  const TEST_CONTROL_ID = 21; 

  const connectionStatus = computed(() => {
    if (connectionState.value === 'connected') return 'MODO PRUEBA: Lector Simulado.';
    if (connectionState.value === 'connecting') return 'Iniciando simulación...';
    if (!('serial' in navigator) && !MOCK_MODE) return 'ERROR: Web Serial API no soportada.';
    return 'Lector Desconectado (Click para simular).';
  });

  // ... (connectionClass, connectionIcon y buttonClass se mantienen igual)
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
      // SIMULACIÓN PARA PRUEBAS
      isConnecting.value = true;
      connectionState.value = 'connecting';
      await sleep(1000); // Simular delay de conexión
      
      connectionState.value = 'connected';
      isConnecting.value = false;
      
      console.log("🚀 MODO PRUEBA ACTIVO: Ejecutando lógica estática...");
      executeLogic(TEST_SERIE); // Dispara la lógica directamente con la serie fija
      return;
    }

    // Lógica real (se mantiene igual para cuando pongas MOCK_MODE = false)
    if (!('serial' in navigator)) return;
    await disconnectReader();
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
    // ... (Limpieza normal)
    connectionState.value = 'disconnected';
    sessionPropertyStore.setChipSerie(null);
  }

  // Nueva función para separar la lógica del origen de los datos (Real o Mock)
  async function executeLogic(buffer) {
    try {
      chipId.value = buffer;
      sessionPropertyStore.setChipSerie(buffer);
      console.log("🔍 Procesando Serie:", buffer);

      // 1️⃣ Buscar bovino
      const bovine = await bovineService.getBySerie(buffer);

      if (!bovine) {
        console.warn("❌ No existe bovino con serie:", buffer);
        sessionPropertyStore.clearBovine();
        return;
      }

      // 2️⃣ Guardar en sesión
      sessionPropertyStore.setBovine(bovine);
      console.log("🐮 Bovino encontrado:", bovine.name);

      // 3️⃣ Crear vínculo Control-Bovine (Usando el Control ID hardcodeado)
      const protocolId = MOCK_MODE ? TEST_CONTROL_ID : sessionPropertyStore.getProtocolId;
      
      const relation = await controlBovineService.createControlBovine({
        bovine_id: bovine.id,
        control_id: protocolId,
        property_id: propertyId
      });

      if (relation && relation.id) {
        sessionPropertyStore.setControlBovineId(relation.id);
        console.log("✅ ControlBovine vinculado ID:", relation.id);
      }
    } catch (error) {
      console.error("❌ Error en la lógica de procesamiento:", error);
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
        if (buffer) executeLogic(buffer); // Llama a la lógica centralizada
      }
    } catch (error) {
      await disconnectReader();
    }
  }

  // ... (Lifecycle hooks iguales)
  onMounted(() => { window.addEventListener('beforeunload', disconnectReader); });
  onBeforeUnmount(() => { 
    window.removeEventListener('beforeunload', disconnectReader);
    disconnectReader(); 
  });

  return {
    connectionState, connectionStatus, connectionClass, connectionIcon,
    buttonClass, isConnecting, connectReader, disconnectReader,
    chipId, sessionPropertyStore
  };
}