import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useSessionPropertyStore } from '@/store/SessionProperty';

export function useSerialReader() {
  const port = ref(null);
  const reader = ref(null);
  const connectionState = ref('disconnected');
  const isConnecting = ref(false);
  const chipId = ref(null);
  const sessionPropertyStore = useSessionPropertyStore();

  const BAUD_RATE = 9600;
  const TEXT_DECODER = new TextDecoder();

  const connectionStatus = computed(() => {
    if (connectionState.value === 'connected') return 'Lector Conectado y Listo.';
    if (connectionState.value === 'connecting') return 'Esperando selección de puerto...';
    if (!('serial' in navigator)) return 'ERROR: Web Serial API no soportada. Use Chrome/Edge.';
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

  async function attemptOpenPort(portInstance, attempts = 2) {
    for (let i = 0; i < attempts; i++) {
      try {
        await portInstance.open({ baudRate: BAUD_RATE });
        return;
      } catch (error) {
        if (i < attempts - 1 && (error.name === 'NetworkError' || error.name === 'InvalidStateError')) {
          console.warn(`Intento ${i + 1} fallido. Esperando 1.5s...`);
          await sleep(1500);
        } else {
          throw error;
        }
      }
    }
  }

  async function connectReader() {
    if (!('serial' in navigator)) {
      connectionState.value = 'disconnected';
      console.error('Web Serial API no soportada.');
      return;
    }

    await disconnectReader(); // Limpieza previa

    isConnecting.value = true;
    connectionState.value = 'connecting';

    try {
      const ports = await navigator.serial.getPorts();
      if (ports.length > 0) {
        console.warn("Puerto ya abierto. Evitando reconexión automática.");
        return;
      }

      port.value = await navigator.serial.requestPort();
      await attemptOpenPort(port.value);

      connectionState.value = 'connected';
      readSerialData();

    } catch (error) {
      connectionState.value = 'disconnected';
      console.error('Error al conectar:', error);
      port.value = null;
    } finally {
      isConnecting.value = false;
    }
  }

  async function disconnectReader() {
    if (reader.value) {
      try { await reader.value.cancel(); } catch (e) { console.warn("Error cancelando reader:", e); }
      try { reader.value.releaseLock(); } catch (e) { console.warn("Error liberando reader:", e); }
      reader.value = null;
    }

    if (port.value) {
      try {
        await port.value.close();
        await sleep(1500);
      } catch (e) {
        console.warn("Error al cerrar el puerto:", e);
      }
      port.value = null;
    }

    connectionState.value = 'disconnected';
    sessionPropertyStore.setChipSerie(null);
  }

  async function readSerialData() {
    if (!port.value || !port.value.readable) {
      console.warn("Puerto no disponible para lectura.");
      return;
    }

    reader.value = port.value.readable.getReader();
    let buffer = '';

    try {
      while (connectionState.value === 'connected') {
        const { value, done } = await reader.value.read();
        if (done) break;

        buffer = TEXT_DECODER.decode(value, { stream: true });
        chipId.value = buffer;
        sessionPropertyStore.setChipSerie(chipId.value);
        console.log("chip en la session:",sessionPropertyStore.chipSerie);
        console.log("Chip leído:", chipId.value);
      }
    } catch (error) {
      console.error('Error durante lectura serial:', error);
      await disconnectReader();
    }
  }

  function handleUnload() {
    disconnectReader();
  }

  onMounted(() => {
    window.addEventListener('beforeunload', handleUnload);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('beforeunload', handleUnload);
    disconnectReader();
  });

  return {
    connectionState,
    connectionStatus,
    connectionClass,
    connectionIcon,
    buttonClass,
    isConnecting,
    connectReader,
    disconnectReader,
    chipId,
    sessionPropertyStore
  };
}
